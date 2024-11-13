import { ObjectId } from 'mongodb';
import { MongoClient } from 'mongodb';
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { options } from "@/app/api/auth/[...nextauth]/options.ts";
import getNextSequenceValue from "@/db/utils/getNextSequenceValue";
import { v4 as uuidv4 } from 'uuid';

const url = process.env.MONGODB_URL;
const dbName = 'scaledb';
const collectionName = 'pages'; // Added collection name

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
            query.slug = id;
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
        const nextVal = await getNextSequenceValue(session.data.organizationId, contactData.key, contactData.projectSlug);
        contactData.key = nextVal;

        let pageSlug = uuidv4().slice(0, 6);

        const newPage = {
            organizationId: session.data.organizationId,
            createdAt: new Date(),
            name: 'My Page',
            slug: pageSlug,
            createdBy: session.data.email,
            organization: session.data.organization,
            organizationId: session.data.organizationId,
            projectName: contactData.projectName,
            projectSlug: contactData.projectSlug
        }
        const pageData = await collection.insertOne(newPage);

        console.log('pageSlug ', pageSlug);

        return new Response(JSON.stringify(pageSlug), { status: 201 });
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
        const { _id, email, ...updateData } = await request.json();

        console.log('object ', new ObjectId(_id));
        // Ensure createdAt is not modified during update
        delete updateData.createdAt;
        updateData.updatedAt = new Date();


        const pageData = await collection.findOneAndUpdate(
            { _id: new ObjectId(_id) },
            { $set: updateData },
            { returnDocument: 'after' } // This option ensures the returned document is the updated one
        );

        console.log("Updated ", updateData.slug);
        const query = { organizationId: session.data.organizationId };
        query.slug = updateData.slug;
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

        const deletedrecords = await collection.deleteMany({ _id: { $in: convertedIds } });

        if (!deletedrecords || deletedrecords.deletedCount === 0) {
            return new Response(JSON.stringify({
                success: false,
                status: 404,
                data: ids
            }));
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
        console.error('Error deleting records:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
        });
    }
}
