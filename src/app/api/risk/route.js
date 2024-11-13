import { ObjectId } from 'mongodb';
import { MongoClient } from 'mongodb';
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { options } from "@/app/api/auth/[...nextauth]/options.ts";
import getNextSequenceValue from "@/db/utils/getNextSequenceValue";

const url = process.env.MONGODB_URL;
const dbName = 'scaledb';
const collectionName = 'risks';
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
        // console.log('id ', id);
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
        contactData.createdAt = new Date();
        contactData.lastUpdatedDate = new Date().toISOString().split('T')[0];
        contactData.reportedDate = new Date().toISOString().split('T')[0];
        contactData.reAssessmentDate = new Date().toISOString().split('T')[0];
        contactData.organization = session.data.organization;
        contactData.organizationId = session.data.organizationId;
        const nextVal = await getNextSequenceValue(session.data.organizationId, contactData.key, contactData.projectSlug);
        contactData.key = nextVal;

        // console.log('nextVal ', nextVal);
        // console.log('contactData ', contactData.projectSlug);

        if (contactData.action === "Open") {
            contactData.ideasForImprovement = "To Do";
        }
        if (contactData.action === "Owned") {
            contactData.ideasForImprovement = "To Do";
        }
        if (contactData.action === "Escalated") {
            contactData.ideasForImprovement = "To Do";
        }
        if (contactData.action === "Accepted") {
            contactData.ideasForImprovement = "";
        }
        if (contactData.action === "Mitigated") {
            contactData.ideasForImprovement = "";
        }
        if (contactData.action === "Resolved") {
            contactData.ideasForImprovement = "";
        }
        if (contactData.action === "Duplicate") {
            contactData.ideasForImprovement = "";
        }

        // Check for existing email
        const existingContact = await collection.findOne({ email: { $regex: new RegExp(`^${contactData.email}$`, 'i') }, organizationId: session.data.organizationId });
        if (existingContact) {
            return new Response(JSON.stringify({ error: 'Email already exists' }), { status: 409 });
        }

        const result = await collection.insertOne(contactData);
        // const riskId = result.insertedId;
        const riskId = result.insertedId.toString();

        if (contactData.impactedWorkItems && contactData.impactedWorkItems.length > 0) {
            const relationalData = contactData.impactedWorkItems.map((item) => ({
                backlogId: item._id,
                backlogSummary: item.summary,
                backlogStatus: item.status,
                backlogPriority: item.priority,
                backlogAssignee: item.assignee,
                backlogWorkItemType: item.workItemType,
                riskId: riskId,
                riskSummary: contactData.summary,
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

        console.log('object ', new ObjectId(_id));
        // Ensure createdAt is not modified during update
        delete updateData.createdAt;
        updateData.updatedAt = new Date();
        updateData.impactedWorkItems = impactedWorkItems;

        if (updateData.action === "Open") {
            updateData.ideasForImprovement = "To Do";
        }
        if (updateData.action === "Owned") {
            updateData.ideasForImprovement = "To Do";
        }
        if (updateData.action === "Escalated") {
            updateData.ideasForImprovement = "To Do";
        }
        if (updateData.action === "Accepted") {
            updateData.ideasForImprovement = "";
        }
        if (updateData.action === "Mitigated") {
            updateData.ideasForImprovement = "";
        }
        if (updateData.action === "Resolved") {
            updateData.ideasForImprovement = "";
        }
        if (updateData.action === "Duplicate") {
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
            // Remove existing impactedWorkItems related to this risk
            await riskWorkitenCollection.deleteMany({ riskId: _id });

            // Insert the updated impactedWorkItems
            const relationalData = impactedWorkItems.map((item) => ({
                backlogId: item._id,
                riskId: _id, // use the original _id
                backlogSummary: item.summary,
                backlogStatus: item.status,
                backlogPriority: item.priority,
                backlogAssignee: item.assignee,
                backlogWorkItemType: item.workItemType,
                riskSummary: updateData.summary,
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
        return new Response(JSON.stringify(records), {
            status: 200,
        });
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
        await riskWorkitenCollection.deleteMany({ riskId: { $in: realtionalConvertedIds } });

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
