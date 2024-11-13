import dbConnect from "@/db/config/dbConnect";
import User from "@/db/models/user";
import bcrypt from 'bcryptjs';
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options.ts";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

dbConnect();
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

    // console.log('Email ', session);
    const email = session?.email;

    // Check if email and password are provided
    if (!email) {
        return new Response(JSON.stringify({
            success: false,
            status: 400,
            message: 'email and password are required',
            data: email,
        }));
    }

    // Find the user in the database
    // const user = await User.findOne({ email });
    const user = await User.findOne({ email: email.toLowerCase() });

    // If user is not found, return an error
    if (!user) {
        const password = uuidv4().slice(0, 8);
        const role = 'Administrator';
        const hashedPassword = await bcrypt.hash(password, 10);
        const users = await User.create({
            timeZone: '',
            dateFormat: '',
            password: hashedPassword,
            sso: true,
            email,
            role: role,
            isOnboarded: false,
            createdBy: email,
            createdAt: new Date()
        });
        return new Response(JSON.stringify(users), { status: 200 });
    } else {
        return new Response(JSON.stringify(user), { status: 200 });
    }

}
