import { MongoClient } from 'mongodb';
import { getServerSession } from "next-auth/next";
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from "next/server";
import { options } from "@/app/api/auth/[...nextauth]/options.ts";
import getNextSequenceValue from "@/db/utils/getNextSequenceValue";
import { addDays } from '@/common/util/dateUtils';


const url = process.env.MONGODB_URL;
const dbName = 'scaledb';
const collectionName = 'sprints';
const stepCollectionName = 'steps';
const backlogsCollectionName = 'backlogs';

let client;
let db;
let collection;
let stepCollection;
let backlogsCollection;

async function connectToDatabase() {
    if (!client) {
        client = await MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db = client.db(dbName);
        collection = db.collection(collectionName);
        stepCollection = db.collection(stepCollectionName);
        backlogsCollection = db.collection(backlogsCollectionName);
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
        const name = formData.get('name');
        const query = { organizationId: session.data.organizationId };
        // console.log('formData ', slug);
        if (id) {
            query._id = new ObjectId(id);
        }
        if (slug) {
            query.projectSlug = slug;
        }
        if (name) {
            query.name = name;
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

        const formData = await request.nextUrl.searchParams;
        const slug = formData.get('slug');
        const query = { organizationId: session.data.organizationId };

        const contactData = await request.json();
        contactData.createdAt = new Date();
        contactData.organization = session.data.organization;
        contactData.organizationId = session.data.organizationId;

        if (!contactData.endDate) {
            const newEndDate = addDays(60);
            contactData.endDate = newEndDate;
        } else {
            contactData.endDate = new Date(contactData.endDate);
        }

        if (!contactData.startDate) {
            contactData.startDate = new Date();
        } else {
            contactData.startDate = new Date(contactData.startDate);
        }

        if (!contactData.name) {
            const nextVal = await getNextSequenceValue(session.data.organizationId, contactData.summary, contactData.projectSlug);
            // Insert space between letters and numbers
            const formattedVal = nextVal.replace(/(\D)(\d)/, '$1 $2');
            contactData.summary = formattedVal;
            contactData.name = formattedVal;
            // console.log('nextVal ', formattedVal);
        }

        if (contactData.name) {
            contactData.summary = contactData.name;
        }

        // Check for existing name
        const existingContact = await collection.findOne({ name: { $regex: new RegExp(`^${contactData.name}$`, 'i') }, organizationId: session.data.organizationId, projectSlug: slug });
        if (existingContact) {
            console.log('existingContact ', existingContact);
            return new Response(JSON.stringify({ error: 'Name already exists' }), { status: 409 });
        }

        const result = await collection.insertOne(contactData);
        const stepResult = await stepCollection.insertOne(contactData);



        if (slug) {
            query.projectSlug = slug;
        }

        const records = await collection.find(query).sort({ createdAt: -1 }).toArray();
        const stepRecords = await stepCollection.find(query).toArray();


        return new Response(JSON.stringify(
            {
                success: true,
                data: records,
                stepData: stepRecords
            }
        ), { status: 201 });
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
        const masterData = await request.json();
        const { userId, _id, oldName, ...updateData } = masterData;

        // console.log('object ', new ObjectId(_id));
        // Ensure createdAt is not modified during update
        delete updateData.createdAt;
        updateData.updatedAt = new Date();
        const formData = await request.nextUrl.searchParams;
        const slug = formData.get('slug');

        if (!updateData.endDate) {
            const newEndDate = addDays(60);
            updateData.endDate = newEndDate;
        } else {
            updateData.endDate = new Date(updateData.endDate);
        }

        if (updateData.startDate) {
            updateData.startDate = new Date(updateData.startDate);
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

        const updatedMaster = await stepCollection.findOneAndUpdate(
            { name: oldName, organizationId: session.data.organizationId, projectSlug: slug },
            { $set: updateData },
            {
                new: true,
                runValidators: true,
            }
        );

        // Update records in the backlogs collection
        // console.log('oldName ', oldName);
        // console.log('updateData ', updateData);

        const step = await stepCollection.findOne({ name: oldName, organizationId: session.data.organizationId, projectSlug: slug }, { projection: { _id: 1 } });
        const stepId = step ? step._id.toString() : null;

        let updateBacklog = {
            updatedAt: new Date(),
            backlogType: 'Sprint',
            stepId: stepId,
            backlogTypeName: updateData?.name
        };

        const updatedRecord = await backlogsCollection.updateMany(
            {
                backlogTypeName: oldName,
                organizationId: session.data.organizationId
            },
            { $set: updateBacklog }
        );
        // Update records in the backlogs collection

        const query = { organizationId: session.data.organizationId };
        const records = await collection.find(query).sort({ createdAt: -1 }).toArray();
        const stepRecords = await stepCollection.find(query).sort({ createdAt: -1 }).toArray();
        return new Response(JSON.stringify(
            {
                success: true,
                data: records,
                stepData: stepRecords
            }
        ), { status: 201 });
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

        const formData = await request.nextUrl.searchParams;
        const slug = formData.get('slug');

        const convertedIds = ids.map(id => new ObjectId(id));


        // Find documents with the specified IDs
        const documents = await collection.find({ _id: { $in: convertedIds } }).toArray();

        // Extract names from the documents
        const names = documents.map(doc => doc.name);
        // console.log('names ', names);

        //Moving workitem to Backlog
        const step = await stepCollection.findOne({ name: 'Product Backlog', organizationId: session.data.organizationId, projectSlug: slug }, { projection: { _id: 1 } });
        const stepId = step ? step._id.toString() : null;

        let updateData = {
            updatedAt: new Date(),
            backlogType: 'WorkItem',
            stepId: stepId, // This will be a single ID or null
            backlogTypeName: 'Product Backlog'
        };
        // Update records in the backlogs collection
        const updatedRecord = await backlogsCollection.updateMany(
            {
                backlogTypeName: { $in: names },
                projectSlug: slug,
                organizationId: session.data.organizationId
            },
            { $set: updateData }
        );
        //Moving workitem to Backlog

        // const deletedSteps = await stepCollection.deleteMany({ name: { $in: names } });
        const deletedSteps = await stepCollection.deleteMany({
            name: { $in: names },
            projectSlug: slug,
            organizationId: session.data.organizationId,
        });

        const deletedrecords = await collection.deleteMany({ _id: { $in: convertedIds } });

        if (!deletedrecords || deletedrecords.deletedCount === 0) {
            return new Response(JSON.stringify({
                success: false,
                status: 404,
                data: ids
            }));
        }
        const query = { organizationId: session.data.organizationId };
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
