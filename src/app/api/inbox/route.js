import { MongoClient } from 'mongodb';
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { options } from "@/app/api/auth/[...nextauth]/options.ts";

const url = process.env.MONGODB_URL;
const dbName = 'scaledb';
const backlogCollectionName = 'backlogs';
const todoCollectionName = 'todos';
const riskCollectionName = 'risks';
const issueCollectionName = 'issues';
const assumptionCollectionName = 'assumptions';

let client;
let db;
let backlogCollection;
let todoCollection;
let riskCollection;
let issueCollection;
let assumptionCollection;

async function connectToDatabase() {
    if (!client) {
        client = await MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db = client.db(dbName);
        backlogCollection = db.collection(backlogCollectionName);
        todoCollection = db.collection(todoCollectionName);
        riskCollection = db.collection(riskCollectionName);
        issueCollection = db.collection(issueCollectionName);
        assumptionCollection = db.collection(assumptionCollectionName);
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
        const query = { assignee: session.data.email };
        if (id) {
            query._id = new ObjectId(id);
        }
        if (slug) {
            query.projectSlug = slug;
        }
        // console.log('id ', id);
        const backlog = await backlogCollection.find(query).sort({ createdAt: -1 }).toArray();
        const todo = await todoCollection.find(query).sort({ createdAt: -1 }).toArray();
        const risk = await riskCollection.find(query).sort({ createdAt: -1 }).toArray();
        const issue = await issueCollection.find(query).sort({ createdAt: -1 }).toArray();
        const assumption = await assumptionCollection.find(query).sort({ createdAt: -1 }).toArray();


        return new Response(JSON.stringify({
            backlog: backlog,
            todo: todo,
            risk: risk,
            issue: issue,
            assumption: assumption,
        }), { status: 200 });
    } catch (error) {
        console.error('Error fetching records:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
        });
    }
}
