import { ObjectId } from 'mongodb';
import { MongoClient } from 'mongodb';
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { options } from "@/app/api/auth/[...nextauth]/options.ts";

const url = process.env.MONGODB_URL;
const dbName = 'scaledb';
const collectionName = 'projects';

let client;
let db;
let collection;

async function connectToDatabase() {
    if (!client) {
        client = await MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db = client.db(dbName);
        collection = db.collection(collectionName);
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
    try {
        await connectToDatabase();
        const { _id, ...updateData } = await request.json();

        const updatedRecord = await collection.updateMany(
            {
                organizationId: session.data.organizationId
            },
            { $set: { isActive: false } }
        );

        // console.log('updatedRecord ', session.data.organizationId);
        // console.log('updatedRecord ', updatedRecord);
        // console.log('object ', new ObjectId(_id));

        const updatedContact = await collection.findOneAndUpdate(
            { _id: new ObjectId(_id) },
            { $set: { isActive: true } },
            { returnDocument: 'after' }  // Optional: This returns the updated document
        );

        return new Response(JSON.stringify(updatedContact), { status: 200 });

    } catch (error) {
        console.error('Error fetching records:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
        });
    }
}


