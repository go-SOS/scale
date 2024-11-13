import { ObjectId } from 'mongodb';
import { MongoClient } from 'mongodb';
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { options } from "@/app/api/auth/[...nextauth]/options.ts";

const url = process.env.MONGODB_URL;
const dbName = 'scaledb';
const collectionName = 'meetings'; // Added collection name

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
        console.error('Error fetching meetings:', error);
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
        const meetingData = await request.json();
        meetingData.createdAt = new Date();
        meetingData.organization = session.data.organization;
        meetingData.organizationId = session.data.organizationId;
        meetingData.createdBy = session.data.email;

        const result = await collection.insertOne(meetingData);

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
        console.error('Error creating meeting:', error);
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

        const convertedIds = ids.map(id => new ObjectId(id));
        const deletedMeetings = await collection.deleteMany({ _id: { $in: convertedIds } });

        if (!deletedMeetings || deletedMeetings.deletedCount === 0) {
            return new Response(JSON.stringify({
                success: false,
                status: 400,
                data: ids
            }));
        }
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
        console.error('Error deleting meetings:', error);
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

    try {
        await connectToDatabase();
        const meetingData = await request.json();
        const { _id, ...updateData } = meetingData;

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
        console.error('Error updating meeting:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
        });
    }
}
