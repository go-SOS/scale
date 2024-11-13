import { promises as fs } from 'fs';
import path from 'path';
import dbConnect from "@/db/config/dbConnect";
import User from "@/db/models/user";
import Member from "@/db/models/member";
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options.ts";
import TeamMaster from "@/db/models/teamMaster";
import UserMaster from "@/db/models/userMaster";
import MemberMaster from "@/db/models/memberMaster";
import AssumptionMaster from "@/db/models/assumptionMaster";
import DependencyMaster from "@/db/models/dependencyMaster";
import DocumentMaster from "@/db/models/documentMaster";
import IssueMaster from "@/db/models/issueMaster";
import RiskMaster from "@/db/models/riskMaster";
import StakeholderMaster from "@/db/models/stakeholderMaster";
import ProjectMaster from "@/db/models/projectMaster";
import BacklogMaster from "@/db/models/backlogMaster";
import SprintMaster from "@/db/models/sprintMaster";
import PageMaster from "@/db/models/pageMaster";
import HolidayMaster from "@/db/models/holidayMaster";
import TimesheetMaster from "@/db/models/timesheetMaster";
import RetrospectiveMaster from "@/db/models/retrospectiveMaster";
import CalendarMaster from "@/db/models/calendarMaster";
import BookmarkMaster from "@/db/models/bookmarkMaster";
import ReleaseMaster from "@/db/models/releaseMaster";
import TimerMaster from "@/db/models/timerMaster";
import TodoMaster from "@/db/models/todoMaster";
import Workflow from "@/db/models/workflow";
// import Step from "@/db/models/step";
// import Sprint from "@/db/models/sprint";
// import Backlog from "@/db/models/backlog";
// import Project from "@/db/models/project";
import { NextRequest, NextResponse } from "next/server";
import TeamcharterMaster from "@/db/models/teamcharterMaster";
import RoadmapMaster from "@/db/models/roadmapMaster";
import { v4 as uuidv4 } from 'uuid';


dbConnect();

async function readJSONFile() {
    const jsonDirectory = path.join(process.cwd(), 'public/json');
    const fullPath = path.join(jsonDirectory, 'iform.json');
    const fileContents = await fs.readFile(fullPath, 'utf8');
    return JSON.parse(fileContents);
}

// export async function GET(request) {
//     const users = await User.find({}).sort({ _id: -1 });
//     let data = JSON.stringify(users);
//     return new Response(data, {
//         status: 200,
//     });
// }
export async function GET(request) {
    const session = await getServerSession(options);
    if (!session) {
        return new Response(JSON.stringify({ message: "Not Authenticated!" }), {
            status: 401,
        });
    }

    const role = session.data.role;

    // Only superadmin can retrieve all users
    if (role === 'superadmin') {
        const users = await User.find({}).sort({ _id: -1 });
        let data = JSON.stringify(users);
        return new Response(data, {
            status: 200,
        });
    }
    else if (role === 'Member' || role === 'Administrator') {
        const formData = await request.nextUrl.searchParams;
        const id = formData.get('id');
        const users = await User.find({ _id: id });
        let data = JSON.stringify(users);
        return new Response(data, {
            status: 200,
        });
    }
    else {
        return new Response(JSON.stringify({ message: "Not Authorized!" }), {
            status: 403,
        });
    }
}


export async function POST(request) {
    const session = await getServerSession(options);
    if (!session) {
        return new Response(JSON.stringify({ message: "Not Authenticated!" }), {
            status: 401,
        });
    }

    const { organization, email, timeZone, dateFormat, fullName, userRole, domainExpertise, companySize } = await request.json();
    const userId = session.data._id;
    // console.log('UserID ', userId);

    const users = await User.findById(userId);
    if (!users) {
        return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    // console.log('existingUser ', users);

    // Check for existing organization and modify name if necessary
    let uniqueOrganization = organization;
    let suffix = 1;
    let existingOrganization = await User.findOne({ organization: uniqueOrganization });

    while (existingOrganization) {
        uniqueOrganization = organization + suffix;
        existingOrganization = await User.findOne({ organization: uniqueOrganization });
        suffix++;
    }

    let organizationId = uuidv4().slice(0, 8);

    // Hash the password before storing it in the database
    // const hashedPassword = await bcrypt.hash(password, 10);
    const role = 'Administrator';
    users.organization = organization;
    users.organizationId = organizationId;
    users.organizationUrl = uniqueOrganization;
    users.timeZone = timeZone;
    users.dateFormat = dateFormat;
    users.fullName = fullName;
    users.userRole = userRole;
    users.domainExpertise = domainExpertise;
    users.companySize = companySize;
    users.isOnboarded = true;
    users.role = role;
    await users.save();

    // Read data from JSON file
    //Creting Master Form Data
    const iforms = await readJSONFile();

    let teams = iforms[0].team;
    let user = iforms[0].user;
    let members = iforms[0].member;
    let dependencies = iforms[0].dependency;
    let issues = iforms[0].issue;
    let risks = iforms[0].risk;
    let stakeholders = iforms[0].stakeholder;
    let documents = iforms[0].document;
    let projects = iforms[0].project;
    let backlogs = iforms[0].backlog;
    let sprints = iforms[0].sprint;
    let pages = iforms[0].page;
    let assumptions = iforms[0].assumption;
    let teamcharters = iforms[0].teamcharter;
    let holidays = iforms[0].holiday;
    let retrospectives = iforms[0].retrospective;
    let timesheets = iforms[0].timesheet;
    let calendars = iforms[0].calendar;
    let bookmarks = iforms[0].bookmark;
    let releases = iforms[0].release;
    let roadmaps = iforms[0].roadmap;
    let timers = iforms[0].timer;
    let todos = iforms[0].todo;

    // let steps = {
    //     name: 'WorkItem',
    //     type: 'WorkItem',
    //     projectSlug: "first-project",
    //     projectName: "First Project"
    // }
    // let sprintStep = {
    //     name: 'SCRUM Sprint',
    //     summary: 'SCRUM Sprint',
    //     type: 'Sprint',
    //     projectSlug: "first-project",
    //     projectName: "First Project",
    //     backlogType: "Sprint",
    //     backlogTypeName: "SCRUM Sprint"
    // }
    // let backlogData = {
    //     summary: 'First work item added',
    //     name: 'First work item added',
    //     projectSlug: "first-project",
    //     projectName: "First Project",
    //     workItemType: "Epic",
    //     backlogKey: "FIPR-WORK-1",
    //     backlogType: "WorkItem",
    //     backlogTypeName: "WorkItem"
    // }
    // let projectData = {
    //     projectSlug: "first-project",
    //     projectName: "First Project",
    //     projectKey: "FIPR"
    // }

    const masterData = {
        userId: users._id,
        organization: organization,
        organizationUrl: uniqueOrganization,
        organizationId: organizationId,
        owner: users.email,
        createdBy: users.fullName,
        updatedAt: new Date(),
        createdAt: new Date(),
    }

    // const mergedSteps = { ...steps, ...masterData };
    // const mergedSprintSteps = { ...sprintStep, ...masterData };
    // const mergedBacklog = { ...backlogData, ...masterData };
    // const mergedProject = { ...projectData, ...masterData };

    // Creating Intial Workflow
    async function createWorkflow(workflow) {
        const workflowData = {
            userId: users._id,
            organization: organization,
            organizationUrl: uniqueOrganization,
            organizationId: organizationId,
            owner: users.email,
            name: workflow.name,
            stages: workflow.stages,
            createdBy: users.fullName,
            updatedAt: new Date(),
            createdAt: new Date(),
        };
        await Workflow.create(workflowData);
    }

    const workflowStages = iforms[0].workflow;

    for (let i = 0; i < workflowStages.length; i++) {
        await createWorkflow(iforms[0].workflow[i]);
    }
    // Creating Intial Workflow

    masterData.teams = teams;
    masterData.users = user;
    masterData.members = members;
    masterData.dependencies = dependencies;
    masterData.issues = issues;
    masterData.risks = risks;
    masterData.stakeholders = stakeholders;
    masterData.documents = documents;
    masterData.projects = projects;
    masterData.backlogs = backlogs;
    masterData.sprints = sprints;
    masterData.pages = pages;
    masterData.assumptions = assumptions;
    masterData.teamcharters = teamcharters;
    masterData.holidays = holidays;
    masterData.timesheets = timesheets;
    masterData.calendars = calendars;
    masterData.bookmarks = bookmarks;
    masterData.releases = releases;
    masterData.roadmaps = roadmaps;
    masterData.timers = timers;
    masterData.todos = todos;
    masterData.retrospectives = retrospectives;

    // await Project.create(mergedProject);
    // await Step.create(mergedSteps);
    // await Step.create(mergedSprintSteps);
    // await Sprint.create(mergedSprintSteps);
    // await Backlog.create(mergedBacklog);
    await TeamMaster.create(masterData);
    await UserMaster.create(masterData);
    await MemberMaster.create(masterData);
    await DependencyMaster.create(masterData);
    await DocumentMaster.create(masterData);
    await IssueMaster.create(masterData);
    await RiskMaster.create(masterData);
    await StakeholderMaster.create(masterData);
    await ProjectMaster.create(masterData);
    await BacklogMaster.create(masterData);
    await SprintMaster.create(masterData);
    await PageMaster.create(masterData);
    await AssumptionMaster.create(masterData);
    await TeamcharterMaster.create(masterData);
    await HolidayMaster.create(masterData);
    await TimesheetMaster.create(masterData);
    await RetrospectiveMaster.create(masterData);
    await CalendarMaster.create(masterData);
    await BookmarkMaster.create(masterData);
    await ReleaseMaster.create(masterData);
    await RoadmapMaster.create(masterData);
    await TimerMaster.create(masterData);
    await TodoMaster.create(masterData);
    masterData.role = role;
    masterData.email = users.email;
    masterData.fullName = fullName;
    masterData.isSuperAdmin = true;
    await Member.create(masterData);

    //Creting Master Form Data

    let data = JSON.stringify(users);
    return new Response(data, {
        status: 200,
    });

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
    try {
        const { _id, email, ...updateData } = await request.json();

        delete updateData.createdAt;
        updateData.updatedAt = new Date();

        const updatedData = await User.findByIdAndUpdate(new ObjectId(_id), updateData, {
            new: true,
            runValidators: true,
        });

        if (!updatedData) {
            return new Response('Data not found', { status: 404 });
        }

        const formData = await request.nextUrl.searchParams;
        const id = formData.get('id');
        const users = await User.find({ _id: id });
        let data = JSON.stringify(users);
        return new Response(data, {
            status: 200,
        });
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
        return new Response(JSON.stringify({ message: "Not Authenticated!" }), {
            status: 401,
        });
    }

    const role = session.data.role;

    if (role !== 'superadmin') {
        return new Response(JSON.stringify({ message: "Not Authorized!" }), {
            status: 403,
        });
    }

    const ids = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
        return new Response(JSON.stringify({
            error: 'Invalid IDs format',
            status: 400,
        }), {
            status: 400,
        });
    }

    const convertedIds = ids.map(id => new ObjectId(id));

    const deletedRecords = await User.deleteMany({ _id: { $in: convertedIds } });

    if (!deletedRecords || deletedRecords.deletedCount === 0) {
        return new Response(JSON.stringify({
            success: false,
            status: 404,
            data: ids
        }), {
            status: 404,
        });
    }

    // Only superadmin can retrieve all users
    if (role === 'superadmin') {
        const users = await User.find({}).sort({ _id: -1 });
        let data = JSON.stringify(users);
        return new Response(data, {
            status: 200,
        });
    } else {
        return new Response(JSON.stringify({ message: "Not Authorized!" }), {
            status: 403,
        });
    }

    // return new Response(JSON.stringify({
    //     success: true,
    //     deletedCount: deletedRecords.deletedCount,
    //     status: 200,
    // }), {
    //     status: 200,
    // });
}

