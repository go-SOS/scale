import { MongoClient } from 'mongodb';
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { options } from "@/app/api/auth/[...nextauth]/options.ts";
import dayjs from 'dayjs';

const url = process.env.MONGODB_URL;
const dbName = 'scaledb';
const backlogCollectionName = 'backlogs';
const todoCollectionName = 'todos';
const riskCollectionName = 'risks';
const issueCollectionName = 'issues';
const assumptionCollectionName = 'assumptions';
const dependencyCollectionName = 'dependencies';

let client;
let db;
let backlogCollection;
let todoCollection;
let riskCollection;
let issueCollection;
let assumptionCollection;
let dependencyCollection;

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
        dependencyCollection = db.collection(dependencyCollectionName);
    }
}

export async function GET(request) {
    const session = await getServerSession(options);
    if (!session) {
        return NextResponse.json(
            { message: "Not Authenticated!" },
            { status: 401 }
        );
    }
    try {
        await connectToDatabase();
        const formData = await request.nextUrl.searchParams;
        const slug = formData.get('slug');

        const query = {
            organizationId: session.data.organizationId,
            status: { $nin: ['Closed', 'Duplicate', 'Done', 'Cancelled', 'Resolved', 'Completed', 'Not Valid'] }
        };
        const role = session.data.role;
        if (slug) {
            query.projectSlug = slug;
        }
        if (role === "Member") {
            query.assignee = session.data.email;
        }

        const collections = [
            { collection: backlogCollection, name: 'backlog' },
            { collection: todoCollection, name: 'todo' },
            { collection: riskCollection, name: 'risk' },
            { collection: issueCollection, name: 'issue' },
            { collection: assumptionCollection, name: 'assumption' },
            { collection: dependencyCollection, name: 'dependency' },
        ];

        const currentDate = dayjs();
        const overdue = [];
        const dueNextDay = [];
        const dueNextWeek = [];
        const dueNextMonth = [];

        for (const { collection, name } of collections) {
            const records = await collection.find(query).sort({ createdAt: -1 }).toArray();
            records.forEach(record => {
                if (record.dueDate) {
                    const dueDate = dayjs(record.dueDate);
                    const diffInDays = dueDate.diff(currentDate, 'day');
                    const recordWithCollectionName = { ...record, collection: name };

                    if (diffInDays < 0) {
                        overdue.push(recordWithCollectionName);
                    } else if (diffInDays === 1) {
                        dueNextDay.push(recordWithCollectionName);
                    } else if (diffInDays <= 7) {
                        dueNextWeek.push(recordWithCollectionName);
                    } else if (diffInDays <= 30) {
                        dueNextMonth.push(recordWithCollectionName);
                    }
                }
            });
        }

        return new Response(JSON.stringify({
            overdue,
            dueNextDay,
            dueNextWeek,
            dueNextMonth,
        }), { status: 200 });
    } catch (error) {
        console.error('Error fetching records:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
