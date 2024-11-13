import { ObjectId } from 'mongodb';
import { MongoClient } from 'mongodb';
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { options } from "@/app/api/auth/[...nextauth]/options.ts";

const url = process.env.MONGODB_URL;
const dbName = 'scaledb';
const collectionName = 'members';
const stakeCollectionName = 'stakeholders';

let client;
let db;
let collection;
let stakeCollection;

async function connectToDatabase() {
    if (!client) {
        client = await MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db = client.db(dbName);
        collection = db.collection(collectionName);
        stakeCollection = db.collection(stakeCollectionName);
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
        const query = { organizationId: session.data.organizationId };

        if (slug) {
            query.projectSlug = slug;
        }

        const memberQuery = { organizationId: session.data.organizationId }
        const members = await collection.find(memberQuery).sort({ createdAt: -1 }).toArray();
        const stakeholders = await stakeCollection.find(query).sort({ createdAt: -1 }).toArray();

        const adminQuery = { organizationId: session.data.organizationId }
        adminQuery.isSuperAdmin = true;
        // adminQuery.role = 'Administrator';
        const admins = await collection.find(adminQuery).sort({ createdAt: -1 }).toArray();
        // console.log('admins ', admins)
        // Filter out administrators from the members list
        // const filteredMembers = members.filter(member => member.role !== 'Administrator');
        const filteredMembers = members.filter(member =>
            member.projects?.some(project => project.slug === slug) && member.isSuperAdmin !== true
        );
        // console.log('filteredMembers slug ', slug);
        // console.log('filteredMembers members ', members);
        // console.log('filteredMembers ', filteredMembers);
        // Combine filtered members and admins
        const combinedArray = [...filteredMembers, ...admins, ...stakeholders];
        return new Response(JSON.stringify(combinedArray), { status: 200 });
    } catch (error) {
        console.error('Error fetching records:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
        });
    }
}


