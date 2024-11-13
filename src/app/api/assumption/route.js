import { ObjectId } from 'mongodb';
import { MongoClient } from 'mongodb';
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { options } from "@/app/api/auth/[...nextauth]/options.ts";
import getNextSequenceValue from "@/db/utils/getNextSequenceValue";

const url = process.env.MONGODB_URL;
const dbName = 'scaledb';
const collectionName = 'assumptions';
const riskWorkitenCollectionName = 'riskworkitem';

let client;
let db;
let collection;
let riskWorkitenCollection;

async function connectToDatabase() {
    if (!client) {
        client = await MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db = client.db(dbName);
        collection = db.collection(collectionName);
        riskWorkitenCollection = db.collection(riskWorkitenCollectionName);
    }
}

export async function GET(request) {
    const session = await getServerSession(options);
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
        console.log('id ', id);
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
    const session = await getServerSession(options);
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
        contactData.lastUpdateDate = new Date().toISOString().split('T')[0];
        contactData.reportedDate = new Date().toISOString().split('T')[0];
        contactData.reAssessmentDate = new Date().toISOString().split('T')[0];
        contactData.organization = session.data.organization;
        contactData.organizationId = session.data.organizationId;
        contactData.createdAt = new Date();
        const nextVal = await getNextSequenceValue(session.data.organizationId, contactData.key, contactData.projectSlug);
        contactData.key = nextVal;

        if (contactData.status === "Open") {
            contactData.ideasForImprovement = "To Do";
        }
        if (contactData.status === "To be Confirmed") {
            contactData.ideasForImprovement = "To Do";
        }
        if (contactData.status === "Valid") {
            contactData.ideasForImprovement = "";
        }
        if (contactData.status === "Not Valid") {
            contactData.ideasForImprovement = "";
        }
        if (contactData.status === "Duplicate") {
            contactData.ideasForImprovement = "";
        }

        // Check for existing email
        const existingContact = await collection.findOne({ email: { $regex: new RegExp(`^${contactData.email}$`, 'i') }, organizationId: session.data.organizationId });
        if (existingContact) {
            return new Response(JSON.stringify({ error: 'Email already exists' }), { status: 409 });
        }

        const result = await collection.insertOne(contactData);
        const assumptionId = result.insertedId.toString();

        if (contactData.impactedWorkItems && contactData.impactedWorkItems.length > 0) {
            const relationalData = contactData.impactedWorkItems.map((item) => ({
                backlogId: item._id,
                backlogSummary: item.summary,
                backlogStatus: item.status,
                backlogPriority: item.priority,
                backlogAssignee: item.assignee,
                backlogWorkItemType: item.workItemType,
                assumptionId: assumptionId,
                assumptionSummary: contactData.summary,
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
    const session = await getServerSession(options);
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
        const { _id, email, impactedWorkItems, ...updateData } = await request.json();

        // console.log('object ', new ObjectId(_id));
        // Ensure createdAt is not modified during update
        delete updateData.createdAt;
        updateData.updatedAt = new Date();
        updateData.impactedWorkItems = impactedWorkItems;

        if (updateData.status === "Open") {
            updateData.ideasForImprovement = "To Do";
        }
        if (updateData.status === "To be Confirmed") {
            updateData.ideasForImprovement = "To Do";
        }
        if (updateData.status === "Valid") {
            updateData.ideasForImprovement = "";
        }
        if (updateData.status === "Not Valid") {
            updateData.ideasForImprovement = "";
        }
        if (updateData.status === "Duplicate") {
            updateData.ideasForImprovement = "";
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


        if (impactedWorkItems && impactedWorkItems.length > 0) {
            await riskWorkitenCollection.deleteMany({ assumptionId: _id });

            // Insert the updated impactedWorkItems
            const relationalData = impactedWorkItems.map((item) => ({
                backlogId: item._id,
                assumptionId: _id, // use the original _id
                backlogSummary: item.summary,
                backlogStatus: item.status,
                backlogPriority: item.priority,
                backlogAssignee: item.assignee,
                backlogWorkItemType: item.workItemType,
                assumptionSummary: updateData.summary,
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
    const session = await getServerSession(options);
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
        const realtionalConvertedIds = ids.map(id => id);

        const deletedrecords = await collection.deleteMany({ _id: { $in: convertedIds } });

        if (!deletedrecords || deletedrecords.deletedCount === 0) {
            return new Response(JSON.stringify({
                success: false,
                status: 404,
                data: ids
            }));
        }

        // Remove associated impacted work items
        await riskWorkitenCollection.deleteMany({ assumptionId: { $in: realtionalConvertedIds } });


        const formData = await request.nextUrl.searchParams;
        const slug = formData.get('slug');
        const query = { organizationId: session.data.organizationId };
        if (slug) {
            query.projectSlug = slug;
        }
        const records = await collection.find(query).sort({ createdAt: -1 }).toArray();
        return new Response(JSON.stringify(records), {
            status: 200,
        });
    } catch (error) {
        console.error('Error deleting records:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
        });
    }
}
