import { ObjectId } from 'mongodb';
import { MongoClient } from 'mongodb';
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { options } from "@/app/api/auth/[...nextauth]/options.ts";

const url = process.env.MONGODB_URL;
const dbName = 'scaledb';
const riskWorkitenCollectionName = 'riskworkitem';

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
        collection = db.collection(riskWorkitenCollectionName);
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
        const backlogId = formData.get('backlogId');
        const riskId = formData.get('riskId');
        const assumptionId = formData.get('assumptionId');
        const dependencyId = formData.get('dependencyId');
        const issueId = formData.get('issueId');
        const query = { organizationId: session.data.organizationId };
        // console.log('id ', id);
        if (backlogId) {
            query.backlogId = backlogId;
        }
        if (riskId) {
            query.riskId = riskId;
        }
        if (assumptionId) {
            query.assumptionId = assumptionId;
        }
        if (dependencyId) {
            query.dependencyId = dependencyId;
        }
        if (issueId) {
            query.issueId = issueId;
        }
        if (slug) {
            query.projectSlug = slug;
        }
        // console.log('query ', query);
        const records = await collection.find(query).toArray();
        return new Response(JSON.stringify(records), { status: 200 });
    } catch (error) {
        console.error('Error fetching records:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
        });
    }
}

