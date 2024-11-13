import dbConnect from "@/db/config/dbConnect";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options.ts";
import Organization from "@/db/models/organization";
import User from "@/db/models/user";
import bcrypt from 'bcryptjs'; 
import { NextRequest, NextResponse } from "next/server";

dbConnect();

export async function GET(req) {
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
        const organizations = await Organization.find({ organization: session.data.organization });

        let data = JSON.stringify(organizations);
        return new Response(data, {
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({
            message: 'Error fetching organizations',
            status: 500,
            error: error.message,
        }));
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
        const organizationData = await request.json();
        organizationData.userId = session.data._id;
        organizationData.status = "Active";
        organizationData.updatedAt = new Date();

        console.log('organizationData ', organizationData);

        const organizations = await Organization.create(organizationData);
        const data = JSON.stringify(organizations);

        return new Response(data, {
            status: 200,
        });
    } catch (error) {
        // Handle the error and return an appropriate error response
        return new Response(JSON.stringify({
            message: 'Error creating organization',
            error: error.message, // Optionally, you can include the error message for debugging
            status: 500, // Internal Server Error
        }));
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

    const organizationData = await request.json();

    organizationData.updatedAt = new Date();

    let email = organizationData.email;
    let password = organizationData.password;
    let role = organizationData.role;
    let organization = organizationData.organization;
    let fullName = organizationData.fullName;
    let lastModifiedBy = organizationData.lastModifiedBy;
    let createdBy = organizationData.createdBy;
    let updatedAt = new Date();

    let updateData = {
        teamMember: organizationData.teamMember,
        lastModifiedBy: organizationData.lastModifiedBy,
        updatedAt: new Date()
    }

    // Insert Team in  user collection
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return new Response({
            message: 'Email is already taken',
            status: 400,
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Data ', email, '   ', password, '   ', hashedPassword);

    const users = await User.create({ email, password: hashedPassword, fullName, role, organization, lastModifiedBy, createdBy, updatedAt });
    console.log('users ', users);
    // Insert Team in  user collection


    const updatedOrganization = await Organization.findOneAndUpdate({ organization: organization }, updateData, {
        new: true,
        runValidators: true,
    });

    if (!updatedOrganization) {
        return new Response('User not found', { status: 404 });
    }

    const data = JSON.stringify(updatedOrganization);
    return new Response(data, { status: 200 });
}

