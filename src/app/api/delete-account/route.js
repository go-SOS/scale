import { MongoClient } from 'mongodb';
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { options } from "@/app/api/auth/[...nextauth]/options.ts";

const url = process.env.MONGODB_URL;
const dbName = 'scaledb';

const collectionNames = [
    'backlogs', 'backlogmasters', 'sprints', 'sprintmasters', 'steps',
    'projects', 'projectmasters', 'users', 'usermasters', 'members',
    'risks', 'riskmasters', 'assumptions', 'assumptionmasters', 'issues',
    'issuemasters', 'dependencies', 'dependencymasters', 'bookmarks',
    'emailrecords', 'timesheets', 'timesheetmasters', 'todos', 'stakeholders',
    'stakeholdermasters', 'timers', 'teamcharters', 'teamchartermasters',
    'workflows', 'filters', 'documents', 'documentmaster', 'dashboards',
    'counters', 'calendars', 'calendarmaster', 'holidays', 'holidaymaster',
    'meetings', 'pages', 'pagemasters', 'releases', 'releasemasters',
    'retrospectives', 'retrospectivemasters'
];

let client;
let db;

async function connectToDatabase() {
    if (!client) {
        client = await MongoClient.connect(url);
        db = client.db(dbName);
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
        const organizationId = session.data.organizationId;

        // Deleting records from all specified collections
        const deletePromises = collectionNames.map(collectionName => {
            const collection = db.collection(collectionName);
            return collection.deleteMany({ organizationId });
        });

        await Promise.all(deletePromises);

        return new Response(JSON.stringify('Deleted!'), { status: 201 });
    } catch (error) {
        console.error('Error updating or deleting records:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
        });
    }
}
