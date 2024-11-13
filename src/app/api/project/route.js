import { MongoClient } from 'mongodb';
import { getServerSession } from "next-auth/next";
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from "next/server";
import { options } from "@/app/api/auth/[...nextauth]/options.ts";
import { addDays } from '@/common/util/dateUtils';
// import { v4 as uuidv4 } from 'uuid';

const url = process.env.MONGODB_URL;
const dbName = 'scaledb';
const collectionName = 'projects';
const counterCollectionName = 'counters';
const stepCollectionName = 'steps';
const teamcharterCollectionName = 'teamcharters';
const dashboardCollectionName = 'dashboards';
// const pageCollectionName = 'pages';

let client;
let db;
let collection;
let counterCollection;
let stepCollection;
let teamcharterCollection;
let dashboardCollection;
// let pageCollection;

async function connectToDatabase() {
    if (!client) {
        client = await MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db = client.db(dbName);
        collection = db.collection(collectionName);
        counterCollection = db.collection(counterCollectionName);
        stepCollection = db.collection(stepCollectionName);
        teamcharterCollection = db.collection(teamcharterCollectionName);
        dashboardCollection = db.collection(dashboardCollectionName);
        // pageCollection = db.collection(pageCollectionName);
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
        console.log('session ', session);

        const formData = await request.nextUrl.searchParams;
        const id = formData.get('id');
        const query = { organizationId: session.data.organizationId };

        // Extract slugs from session projects
        const projectSlugs = session?.data?.projects?.map(project => project.slug);

        // Add _id filter if present in the request
        if (id) {
            query._id = new ObjectId(id);
        }

        // Add slug filter to the query if not a super admin
        if (!session.data.isSuperAdmin) {
            query.projectSlug = { $in: projectSlugs };
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
        contactData.organization = session.data.organization;
        contactData.organizationId = session.data.organizationId;

        // console.log('contactData.projectName ', contactData.projectName);

        // Check for existing projectName or projectKey
        const existingProjectName = await collection.findOne({
            projectName: { $regex: new RegExp(`^${contactData.projectName}$`, 'i') },
            organizationId: session.data.organizationId
        });

        if (existingProjectName) {
            return new Response(JSON.stringify({ nameError: 'Project name already exists' }), { status: 409 });
        }

        const existingProjectKey = await collection.findOne({
            projectKey: { $regex: new RegExp(`^${contactData.projectKey}$`, 'i') },
            organizationId: session.data.organizationId
        });

        if (existingProjectKey) {
            return new Response(JSON.stringify({ keyError: 'Key already exists. Please enter another key.' }), { status: 409 });
        }


        const counterData = {
            projectName: contactData.projectName,
            projectSlug: contactData.projectSlug,
            projectKey: contactData.projectKey,
            count: 1,
            userId: session.data._id,
            organizationId: session.data.organizationId,
            createdBy: session.data.fullName
        };

        const result = await collection.insertOne(contactData);
        const counter = await counterCollection.insertOne(counterData);


        if (!contactData.expectedStartDate) {
            contactData.expectedStartDate = new Date();
        } else {
            contactData.expectedStartDate = new Date(contactData.expectedStartDate);
        }

        if (!contactData.expectedEndDate) {
            const newEndDate = addDays(180);
            contactData.expectedEndDate = newEndDate;
        } else {
            contactData.expectedEndDate = new Date(contactData.expectedEndDate);
        }

        const steps = {
            name: 'Product Backlog',
            type: 'WorkItem',
            summary: contactData.projectName,
            userId: session.data._id,
            organizationId: session.data.organizationId,
            startDate: contactData.expectedStartDate,
            endDate: contactData.expectedEndDate,
            createdAt: new Date(),
            createdBy: session.data.fullName,
            projectName: contactData.projectName,
            projectSlug: contactData.projectSlug
        }

        const stepsData = await stepCollection.insertOne(steps);

        const teamcharter = {
            userId: session.data._id,
            organizationId: session.data.organizationId,
            // projectVision: contactData?.projectVision,
            // projectMission: contactData?.projectMission,
            // projectDescription: contactData?.projectDescription,
            // projectRequirements: contactData?.projectRequirements,
            // expectedStartDate: contactData?.expectedStartDate,
            // expectedEndDate: contactData?.expectedEndDate,
            // successCriteria: contactData?.successCriteria,
            // rulesOfConduct: contactData?.rulesOfConduct,
            createdAt: new Date(),
            createdBy: session.data.fullName,
            projectName: contactData.projectName,
            projectSlug: contactData.projectSlug
        }

        const dashData = {
            userId: session.data._id,
            organizationId: session.data.organizationId,
            createdAt: new Date(),
            createdBy: session.data.fullName,
            projectName: contactData.projectName,
            projectSlug: contactData.projectSlug
        }

        // const newPage = {
        //     userId: session.data._id,
        //     createdAt: new Date(),
        //     name: 'My 1st Page',
        //     slug: uuidv4().slice(0, 6), 
        //     first: true,
        //     createdBy: session.data.email,
        //     projectName: contactData.projectName,
        //     projectSlug: contactData.projectSlug
        // }

        // const pageData = await pageCollection.insertOne(newPage);
        // console.log('teamcharter ', teamcharter);
        const teamcharterData = await teamcharterCollection.insertOne(teamcharter);
        dashData.dashboardState = {
            "tasks": {
                "1": {
                    "id": "Backlog",
                    "title": "Backlog"
                },
                "2": {
                    "id": "Risk",
                    "title": "Risk"
                },
                "3": {
                    "id": "Assumption",
                    "title": "Assumption"
                },
                "4": {
                    "id": "Dependency",
                    "title": "Dependency"
                },
                "5": {
                    "id": "Issue",
                    "title": "Issue"
                }
            },
            "columns": {
                "First": {
                    "id": "First",
                    "title": "First",
                    "taskIds": [
                        1,
                        2,
                        3
                    ]
                },
                "Second": {
                    "id": "Second",
                    "title": "Second",
                    "taskIds": [
                        4,
                        5
                    ]
                }
            },
            "columnOrder": [
                "First",
                "Second"
            ]
        };
        const dashboardData = await dashboardCollection.insertOne(teamcharter);

        // console.log('stepsData ', stepsData);

        const records = await collection.find({ organizationId: session.data.organizationId }).sort({ createdAt: -1 }).toArray();

        return new Response(JSON.stringify(records), { status: 200 });
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
        const { _id, ...updateData } = await request.json();

        // console.log('object ', new ObjectId(_id));
        // Ensure createdAt is not modified during update
        delete updateData.createdAt;
        updateData.updatedAt = new Date();

        // console.log('updateData ', updateData);

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

        const oldName = 'Product Backlog';
        const stepType = 'WorkItem';
        const updatedSteps = {
            startDate: new Date(updateData.expectedStartDate),
            endDate: new Date(updateData.expectedEndDate),
        }

        const updatedMaster = await stepCollection.findOneAndUpdate(
            { name: oldName, type: stepType, organizationId: session.data.organizationId, projectSlug: updateData.projectSlug },
            { $set: updatedSteps },
            {
                new: true,
                runValidators: true,
            }
        );

        const records = await collection.find({ organizationId: session.data.organizationId }).sort({ createdAt: -1 }).toArray();
        return new Response(JSON.stringify(records), { status: 200 });
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

        const records = await collection.find({ organizationId: session.data.organizationId }).sort({ createdAt: -1 }).toArray();
        return new Response(JSON.stringify(records), { status: 200 });
    } catch (error) {
        console.error('Error deleting records:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
        });
    }
}
