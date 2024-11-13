import { MongoClient } from 'mongodb';
import { getServerSession } from "next-auth/next";
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from "next/server";
import { options } from "@/app/api/auth/[...nextauth]/options.ts";

const url = process.env.MONGODB_URL;
const dbName = 'scaledb';
const backlogsCollectionName = 'backlogs';
const sprintsCollectionName = 'sprints';
const stepssCollectionName = 'steps';

let client;
let db;
let backlogsCollection;
let sprintsCollection;
let stepsCollection;

async function connectToDatabase() {
    if (!client) {
        client = await MongoClient.connect(url);
        db = client.db(dbName);
        backlogsCollection = db.collection(backlogsCollectionName);
        sprintsCollection = db.collection(sprintsCollectionName);
        stepsCollection = db.collection(stepssCollectionName);
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
        const sprintName = await request.json();
        // console.log('sprintName ', sprintName.title);

        const formData = await request.nextUrl.searchParams;
        const slug = formData.get('slug');
        const query = { organizationId: session.data.organizationId };
        if (slug) {
            query.projectSlug = slug;
        }

        const step = await stepsCollection.findOne({ name: 'Product Backlog', organizationId: session.data.organizationId, projectSlug: slug }, { projection: { _id: 1 } });
        const stepId = step ? step._id.toString() : null;

        console.log('sprintName ', sprintName.title);
        console.log('stepId ', stepId);

        let updateData = {
            updatedAt: new Date(),
            backlogType: 'WorkItem',
            stepId: stepId, // This will be a single ID or null
            backlogTypeName: 'Product Backlog'
        };
        // Update records in the backlogs collection
        const updatedRecord = await backlogsCollection.updateMany(
            {
                backlogTypeName: sprintName.title,
                organizationId: session.data.organizationId
            },
            { $set: updateData }
        );
        // console.log('updatedRecord ', updatedRecord);

        // Proceed to deletion steps regardless of whether any records were updated
        const deletedSprints = await sprintsCollection.deleteMany({
            name: sprintName.title,
            projectSlug: slug,
            organizationId: session.data.organizationId
        });
        // console.log('deletedSprints ', deletedSprints);

        // const deletedSteps = await deletedSteps.deleteMany({ name: sprintName.title });
        const deletedSteps = await deletedSteps.deleteMany({
            name: sprintName.title,
            projectSlug: slug,
            organizationId: session.data.organizationId
        });
        // console.log('deletedSteps ', deletedSteps);


        const records = await backlogsCollection.find(query).sort({ createdAt: -1 }).toArray();
        return new Response(JSON.stringify(records), { status: 201 });


    } catch (error) {
        console.error('Error updating or deleting records:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
        });
    }
}
