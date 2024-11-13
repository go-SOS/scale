import dbConnect from "@/db/config/dbConnect";
import User from "@/db/models/user";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options.ts";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs'; 
import { ObjectId } from 'mongodb';


dbConnect();

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
        const updateData = await request.json();

        console.log('password ', updateData);

        const hashedPassword = await bcrypt.hash(updateData.password, 10);

        updateData.password = hashedPassword;
        updateData.updatedAt = new Date();

        console.log('password ', updateData);

        const updatedData = await User.findByIdAndUpdate(new ObjectId(session.data._id), updateData, {
            new: true,
            runValidators: true,
        });

        if (!updatedData) {
            return new Response('User not found', { status: 404 });
        }

        const users = await User.find({ _id: session.data._id });
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

