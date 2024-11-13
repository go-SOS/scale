import { MongoClient } from 'mongodb';
import { getServerSession } from "next-auth/next";
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from "next/server";
import { options } from "@/app/api/auth/[...nextauth]/options.ts";
import getNextSequenceValue from "@/db/utils/getNextSequenceValue";
import { addDays } from '@/common/util/dateUtils';

const url = process.env.MONGODB_URL;
const dbName = 'scaledb';
const collectionName = 'backlogs';
const riskWorkitenCollectionName = 'riskworkitem';

let client;
let db;
let collection;
let riskWorkitenCollection;

async function connectToDatabase() {
    if (!client) {
        client = await MongoClient.connect(url);
        db = client.db(dbName);
        collection = db.collection(collectionName);
        riskWorkitenCollection = db.collection(riskWorkitenCollectionName);
    }
}

export async function GET(request) {
    const session = await getServerSession(options)
    if (!session) {
        return NextResponse.json(
            { message: "Not Authenticated!" },
            {
                status: 401,
            }
        );
    }
    try {
        await connectToDatabase();

        const formData = await request.nextUrl.searchParams;
        const slug = formData.get('slug');
        const id = formData.get('id');
        const query = { organizationId: session.data.organizationId };
        if (id) {
            query._id = new ObjectId(id);
        }
        if (slug) {
            query.projectSlug = slug;
        }

        const records = await collection.find(query).sort({ createdAt: -1 }).toArray();
        return new Response(JSON.stringify(records), { status: 200 });
    } catch (error) {
        console.error('Error fetching records:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
        });
    }
}

export async function POST(request) {
    const session = await getServerSession(options)
    if (!session) {
        return NextResponse.json(
            { message: "Not Authenticated!" },
            {
                status: 401,
            }
        );
    }
    try {
        await connectToDatabase();
        const contactData = await request.json();
        contactData.createdAt = new Date();
        contactData.organization = session.data.organization;
        contactData.organizationId = session.data.organizationId;
        const nextVal = await getNextSequenceValue(session.data.organizationId, contactData.backlogKey, contactData.projectSlug);
        contactData.backlogKey = nextVal;

        if (contactData.status === "To Do") {
            contactData.toDoDate = new Date();
        }
        if (contactData.status === "In Progress") {
            contactData.inProgressDate = new Date();
        }
        if (contactData.status === "Done") {
            contactData.doneDate = new Date();
        }

        if (contactData.dueDate) {
            contactData.dueDate = new Date(contactData.dueDate);
        } else {
            const newDueDate = addDays(7);
            contactData.dueDate = newDueDate;
        }

        if (contactData.startDate) {
            contactData.startDate = new Date(contactData.startDate);
        } else {
            contactData.startDate = new Date();
        }

        // Validation: dueDate should be greater than startDate
        if (contactData.dueDate <= contactData.startDate) {
            return new Response(JSON.stringify({ error: "Due date must be greater than start date." }), {
                status: 400,
            });
        }

        const result = await collection.insertOne(contactData);
        const backlogId = result.insertedId.toString();

        if (contactData.risk && contactData.risk.length > 0) {
            let relationalData = contactData.risk.map((item) => ({
                backlogId: backlogId,
                backlogSummary: contactData.summary,
                backlogStatus: contactData.status,
                backlogPriority: contactData.priority,
                backlogAssignee: contactData.assignee,
                backlogWorkItemType: contactData.workItemType,
                riskId: item._id,
                riskSummary: item.summary,
                projectSlug: contactData.projectSlug,
                organization: session.data.organization,
                organizationId: session.data.organizationId,
                createdAt: new Date(),
            }));
            await riskWorkitenCollection.insertMany(relationalData);
        }
        if (contactData.assumption && contactData.assumption.length > 0) {
            let relationalData = contactData.assumption.map((item) => ({
                backlogId: backlogId,
                backlogSummary: contactData.summary,
                backlogStatus: contactData.status,
                backlogPriority: contactData.priority,
                backlogAssignee: contactData.assignee,
                backlogWorkItemType: contactData.workItemType,
                assumptionId: item._id,
                assumptionSummary: item.summary,
                projectSlug: contactData.projectSlug,
                organization: session.data.organization,
                organizationId: session.data.organizationId,
                createdAt: new Date(),
            }));
            await riskWorkitenCollection.insertMany(relationalData);
        }
        if (contactData.issue && contactData.issue.length > 0) {
            let relationalData = contactData.issue.map((item) => ({
                backlogId: backlogId,
                backlogSummary: contactData.summary,
                backlogStatus: contactData.status,
                backlogPriority: contactData.priority,
                backlogAssignee: contactData.assignee,
                backlogWorkItemType: contactData.workItemType,
                issueId: item._id,
                issueSummary: item.summary,
                projectSlug: contactData.projectSlug,
                organization: session.data.organization,
                organizationId: session.data.organizationId,
                createdAt: new Date(),
            }));
            await riskWorkitenCollection.insertMany(relationalData);
        }
        if (contactData.dependency && contactData.dependency.length > 0) {
            let relationalData = contactData.dependency.map((item) => ({
                backlogId: backlogId,
                backlogSummary: contactData.summary,
                backlogStatus: contactData.status,
                backlogPriority: contactData.priority,
                backlogAssignee: contactData.assignee,
                backlogWorkItemType: contactData.workItemType,
                dependencyId: item._id,
                dependencySummary: item.summary,
                projectSlug: contactData.projectSlug,
                organization: session.data.organization,
                organizationId: session.data.organizationId,
                createdAt: new Date(),
            }));
            await riskWorkitenCollection.insertMany(relationalData);
        }



        const formData = await request.nextUrl.searchParams;
        const slug = formData.get('slug');
        const query = { organizationId: session.data.organizationId };
        if (slug) {
            query.projectSlug = slug;
        }
        const records = await collection.find(query).sort({ createdAt: -1 }).toArray();
        return new Response(JSON.stringify(records), { status: 201 });
    } catch (error) {
        console.error('Error creating contact:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
        });
    }
}

export async function PUT(request) {
    const session = await getServerSession(options)
    if (!session) {
        return NextResponse.json(
            { message: "Not Authenticated!" },
            {
                status: 401,
            }
        );
    }
    await connectToDatabase();
    try {
        const { _id, risk, assumption, issue, dependency, ...updateData } = await request.json();

        console.log('object ', new ObjectId(_id));
        // Ensure createdAt is not modified during update
        delete updateData.createdAt;
        updateData.updatedAt = new Date();
        updateData.risk = risk;
        updateData.assumption = assumption;
        updateData.issue = issue;
        updateData.dependency = dependency;

        if (updateData.dueDate) {
            updateData.dueDate = new Date(updateData.dueDate);
        }
        if (updateData.startDate) {
            updateData.startDate = new Date(updateData.startDate);
        }

        if (updateData.status === "To Do") {
            updateData.toDoDate = new Date();
        }
        if (updateData.status === "In Progress") {
            updateData.inProgressDate = new Date();
        }
        if (updateData.status === "Done") {
            updateData.doneDate = new Date();
        }

        // Retrieve the existing document to compare dates
        const oldData = await collection.findOne({ _id: new ObjectId(_id) });

        if (!oldData) {
            return new Response(JSON.stringify({ error: "Document not found." }), { status: 404 });
        }

        // Perform date comparison
        if (updateData.startDate && updateData.dueDate) {
            if (updateData.dueDate <= updateData.startDate) {
                return new Response(JSON.stringify({ error: "Due date must be greater than start date." }), {
                    status: 400,
                });
            }
        } else if (updateData.dueDate) {
            if (updateData.dueDate <= oldData.startDate) {
                return new Response(JSON.stringify({ error: "Due date must be greater than start date." }), {
                    status: 400,
                });
            }
        }

        const updatedContact = collection.findOneAndUpdate({ _id: new ObjectId(_id) }, { $set: updateData }, function (err, doc) {
            if (err) {
                throw err;
            }
            else {
                console.log("Updated");
                return new Response("Updated", {
                    status: 200,
                });
            }
        });

        await riskWorkitenCollection.deleteMany({ backlogId: _id });
        if (risk && risk.length > 0) {
            // Insert the updated impactedWorkItems
            let relationalData = risk.map((item) => ({
                backlogId: _id,
                riskId: item._id,
                backlogSummary: updateData.summary,
                backlogStatus: updateData.status,
                backlogPriority: updateData.priority,
                backlogAssignee: updateData.assignee,
                backlogWorkItemType: updateData.workItemType,
                riskSummary: item.summary,
                projectSlug: updateData.projectSlug,
                organization: session.data.organization,
                organizationId: session.data.organizationId,
                createdAt: new Date(),
            }));
            await riskWorkitenCollection.insertMany(relationalData);
        }
        if (assumption && assumption.length > 0) {
            // Insert the updated impactedWorkItems
            let relationalData = assumption.map((item) => ({
                backlogId: _id,
                assumptionId: item._id,
                backlogSummary: updateData.summary,
                backlogStatus: updateData.status,
                backlogPriority: updateData.priority,
                backlogAssignee: updateData.assignee,
                backlogWorkItemType: updateData.workItemType,
                assumptionSummary: item.summary,
                projectSlug: updateData.projectSlug,
                organization: session.data.organization,
                organizationId: session.data.organizationId,
                createdAt: new Date(),
            }));
            await riskWorkitenCollection.insertMany(relationalData);
        }
        if (issue && issue.length > 0) {
            // Insert the updated impactedWorkItems
            let relationalData = issue.map((item) => ({
                backlogId: _id,
                issueId: item._id,
                backlogSummary: updateData.summary,
                backlogStatus: updateData.status,
                backlogPriority: updateData.priority,
                backlogAssignee: updateData.assignee,
                backlogWorkItemType: updateData.workItemType,
                issueSummary: item.summary,
                projectSlug: updateData.projectSlug,
                organization: session.data.organization,
                organizationId: session.data.organizationId,
                createdAt: new Date(),
            }));
            await riskWorkitenCollection.insertMany(relationalData);
        }
        if (dependency && dependency.length > 0) {
            // Insert the updated impactedWorkItems
            let relationalData = dependency.map((item) => ({
                backlogId: _id,
                dependencyId: item._id,
                backlogSummary: updateData.summary,
                backlogStatus: updateData.status,
                backlogPriority: updateData.priority,
                backlogAssignee: updateData.assignee,
                backlogWorkItemType: updateData.workItemType,
                dependencySummary: item.summary,
                projectSlug: updateData.projectSlug,
                organization: session.data.organization,
                organizationId: session.data.organizationId,
                createdAt: new Date(),
            }));
            await riskWorkitenCollection.insertMany(relationalData);
        }

        const formData = await request.nextUrl.searchParams;
        const slug = formData.get('slug');
        const query = { organizationId: session.data.organizationId };
        if (slug) {
            query.projectSlug = slug;
        }
        const records = await collection.find(query).sort({ createdAt: -1 }).toArray();
        return new Response(JSON.stringify(records), { status: 201 });
    } catch (error) {
        console.error('Error updating contact:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
        });
    }
}

export async function DELETE(request) {
    const session = await getServerSession(options)
    if (!session) {
        return NextResponse.json(
            { message: "Not Authenticated!" },
            {
                status: 401,
            }
        );
    }
    try {
        await connectToDatabase();

        const ids = await request.json();
        if (!Array.isArray(ids) || ids.length === 0) {
            return new Response(JSON.stringify({
                error: 'Invalid IDs format',
                status: 400,
            }));
        }

        const convertedIds = ids.map(id => new ObjectId(id));

        const deletedrecords = await collection.deleteMany({ _id: { $in: convertedIds } });
        const realtionalConvertedIds = ids.map(id => id);

        if (!deletedrecords || deletedrecords.deletedCount === 0) {
            return new Response(JSON.stringify({
                success: false,
                status: 404,
                data: ids
            }));
        }

        await riskWorkitenCollection.deleteMany({ backlogId: { $in: realtionalConvertedIds } });

        const formData = await request.nextUrl.searchParams;
        const slug = formData.get('slug');
        const query = { organizationId: session.data.organizationId };
        if (slug) {
            query.projectSlug = slug;
        }
        const records = await collection.find(query).sort({ createdAt: -1 }).toArray();
        return new Response(JSON.stringify(records), { status: 201 });
    } catch (error) {
        console.error('Error deleting records:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
        });
    }
}
