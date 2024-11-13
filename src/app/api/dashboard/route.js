import { MongoClient } from 'mongodb';
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { options } from "@/app/api/auth/[...nextauth]/options.ts";
import { ObjectId } from 'mongodb';
import { startOfDay, subDays } from 'date-fns';

const url = process.env.MONGODB_URL;
const dbName = 'scaledb';
const backlogCollectionName = 'backlogs';
const sprintCollectionName = 'sprints';
const memberCollectionName = 'members';
const timesheetCollectionName = 'timesheets';
const stakeholderCollectionName = 'stakeholders';
const riskCollectionName = 'risks';
const assumptionCollectionName = 'assumptions';
const issueCollectionName = 'issues';
const dependencyCollectionName = 'dependencies';
const backlogMasterCollectionName = 'backlogmasters';
const riskMasterCollectionName = 'riskmasters';
const assumptionMasterCollectionName = 'assumptionmasters';
const issueMasterCollectionName = 'issuemasters';
const dependencyMasterCollectionName = 'dependencymasters';
const dashboardCollectionName = 'dashboards';

let client;
let db;
let backlogCollection;
let sprintCollection;
let memberCollection;
let timesheetCollection;
let stakeholderCollection;
let riskCollection;
let backlogMasterCollection;
let assumptionCollection;
let issueCollection;
let dependencyCollection;
let riskMasterCollection;
let assumptionMasterCollection;
let issueMasterCollection;
let dependencyMasterCollection;
let dashboardCollection;

async function connectToDatabase() {
    if (!client) {
        client = await MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db = client.db(dbName);
        backlogCollection = db.collection(backlogCollectionName);
        sprintCollection = db.collection(sprintCollectionName);
        memberCollection = db.collection(memberCollectionName);
        timesheetCollection = db.collection(timesheetCollectionName);
        stakeholderCollection = db.collection(stakeholderCollectionName);
        riskCollection = db.collection(riskCollectionName);
        assumptionCollection = db.collection(assumptionCollectionName);
        issueCollection = db.collection(issueCollectionName);
        dependencyCollection = db.collection(dependencyCollectionName);
        backlogMasterCollection = db.collection(backlogMasterCollectionName);
        riskMasterCollection = db.collection(riskMasterCollectionName);
        assumptionMasterCollection = db.collection(assumptionMasterCollectionName);
        issueMasterCollection = db.collection(issueMasterCollectionName);
        dependencyMasterCollection = db.collection(dependencyMasterCollectionName);
        dashboardCollection = db.collection(dashboardCollectionName);
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

        const backlogMaster = await backlogMasterCollection.find({ organizationId: session.data.organizationId }).toArray();
        const riskMaster = await riskMasterCollection.find({ organizationId: session.data.organizationId }).toArray();
        const assumptionMaster = await assumptionMasterCollection.find({ organizationId: session.data.organizationId }).toArray();
        const issueMaster = await issueMasterCollection.find({ organizationId: session.data.organizationId }).toArray();
        const dependencyMaster = await dependencyMasterCollection.find({ organizationId: session.data.organizationId }).toArray();

        const noOfBacklog = await backlogCollection.countDocuments(query);
        const noOfSprint = await sprintCollection.countDocuments(query);
        const noOfMember = await memberCollection.countDocuments(query);
        const noOfTimesheet = await timesheetCollection.countDocuments(query);
        const noOfStakeholder = await stakeholderCollection.countDocuments(query);
        const dashboardData = await dashboardCollection.find(query).toArray();

        const adminQuery = { organizationId: session.data.organizationId }
        adminQuery.role = 'Administrator';
        const noOfAdmin = await memberCollection.countDocuments(adminQuery);
        const totalMember = noOfMember + noOfAdmin;

        const recentBacklogs = await backlogCollection.find(query)
            .sort({ createdAt: -1 })
            .limit(5)
            .toArray();
        const recentRisks = await riskCollection.find(query)
            .sort({ createdAt: -1 })
            .limit(5)
            .toArray();
        const recentAssumptions = await assumptionCollection.find(query)
            .sort({ createdAt: -1 })
            .limit(5)
            .toArray();
        const recentIssues = await issueCollection.find(query)
            .sort({ createdAt: -1 })
            .limit(5)
            .toArray();
        const recentDependencies = await issueCollection.find(query)
            .sort({ createdAt: -1 })
            .limit(5)
            .toArray();


        // Query to get counts
        const today = startOfDay(new Date());
        const thirtyDaysAgo = subDays(today, 30);

        const pipeline = [
            {
                $match: {
                    organizationId: session.data.organizationId,
                    projectSlug: slug,
                    $or: [
                        { createdAt: { $gte: thirtyDaysAgo } },
                        { updatedAt: { $gte: thirtyDaysAgo } },
                        { dueDate: { $gte: thirtyDaysAgo } },
                    ]
                }
            },
            {
                $group: {
                    _id: null,
                    newCount: { $sum: { $cond: [{ $gte: ["$createdAt", thirtyDaysAgo] }, 1, 0] } },
                    updatedCount: { $sum: { $cond: [{ $gte: ["$updatedAt", thirtyDaysAgo] }, 1, 0] } },
                    dueCount: { $sum: { $cond: [{ $and: [{ $gte: ["$dueDate", thirtyDaysAgo] }, { $lte: ["$dueDate", today] }] }, 1, 0] } },
                    doneCount: { $sum: { $cond: [{ $eq: ["$status", "Done"] }, 1, 0] } }
                }
            }
        ];
        const statusResult = await backlogCollection.aggregate(pipeline).toArray();
        // Query to get counts


        let data = {
            noOfBacklog: noOfBacklog,
            noOfSprint: noOfSprint,
            noOfMember: totalMember,
            noOfAdmin: noOfAdmin,
            noOfTimesheet: noOfTimesheet,
            noOfStakeholder: noOfStakeholder,
            recentBacklogs: recentBacklogs,
            recentRisks: recentRisks,
            recentAssumptions: recentAssumptions,
            recentIssues: recentIssues,
            recentDependencies: recentDependencies,
            backlogMaster: backlogMaster,
            riskMaster: riskMaster,
            assumptionMaster: assumptionMaster,
            issueMaster: issueMaster,
            dependencyMaster: dependencyMaster,
            dashboardData: dashboardData,
            statusResult: statusResult
        }
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.error('Error fetching records:', error);
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

        delete updateData.createdAt;
        updateData.updatedAt = new Date();

        const formData = await request.nextUrl.searchParams;
        const slug = formData.get('slug');
        const query = { organizationId: session.data.organizationId };
        if (slug) {
            query.projectSlug = slug;
        }

        const updatedContact = dashboardCollection.findOneAndUpdate({ _id: new ObjectId(_id) }, { $set: updateData }, function (err, doc) {
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

        const records = await dashboardCollection.find({ _id: new ObjectId(_id) }).sort({ createdAt: -1 }).toArray();
        return new Response(JSON.stringify(records), { status: 201 });
    } catch (error) {
        console.error('Error updating contact:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
        });
    }
}