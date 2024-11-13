import dbConnect from "@/db/config/dbConnect";
import Step from "@/db/models/step";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options.ts";
import { NextRequest, NextResponse } from "next/server";

dbConnect();

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

        const formData = await request.nextUrl.searchParams;
        const slug = formData.get('slug');
        const query = { organizationId: session.data.organizationId };
        // console.log('formData ', slug);

        if (slug) {
            query.projectSlug = slug;
        }

        const masters = await Step.find(query);

        let data = JSON.stringify(masters);
        return new Response(data, {
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({
            message: 'Error fetching masters',
            status: 500,
            error: error.message,
        }));
    }
}

export async function POST(request) {
    const masterData = await request.json();
    masterData.createdAt = new Date();
    masterData.updatedAt = new Date();
    masterData.organization = session.data.organization;
    masterData.organizationId = session.data.organizationId;
    const masters = await Step.create(masterData);
    const data = JSON.stringify(masters);
    return new Response(data, {
        status: 200,
    });
}


export async function PUT(request) {
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json(
            { message: "Not Authenticated!" },
            { status: 401 }
        );
    }

    try {
        const masterData = await request.json();
        const { userId, _id, oldName, ...updateData } = masterData;
        updateData.updatedAt = new Date();
        console.log('oldName ', oldName);
        console.log('userId ', userId);

        const updatedMaster = await Step.findOneAndUpdate(
            { userId: userId, name: oldName },
            { $set: updateData },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedMaster) {
            return new Response('Document not found', { status: 404 });
        }

        return new Response(JSON.stringify(updatedMaster), { status: 200 });
    } catch (error) {
        console.error('Error updating document:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}

