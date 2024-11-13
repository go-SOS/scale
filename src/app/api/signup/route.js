import dbConnect from "@/db/config/dbConnect";
import User from "@/db/models/user";
import bcrypt from 'bcryptjs';
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options.ts";
import { NextRequest, NextResponse } from "next/server";

dbConnect();

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
    } else {
        return new Response(JSON.stringify({ message: "Not Authorized!" }), {
            status: 403,
        });
    }
}


export async function POST(request) {

    const { email, password, otp } = await request.json();

    // console.log('password ', password);
    // console.log('email ', email);

    const existingUser = await User.findOne({ email });

    // console.log('existingUser ', existingUser);
    if (existingUser) {
        return new Response(JSON.stringify({ error: 'Email is already taken' }), { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = 'Administrator';

    const users = await User.create({
        timeZone: '',
        dateFormat: '',
        otp: otp,
        password: hashedPassword,
        email: email.toLowerCase(),
        role: role,
        isSuperAdmin: true,
        isOnboarded: false,
        createdBy: email.toLowerCase(),
        createdAt: new Date()
    });

    return new Response(JSON.stringify(users), { status: 200 });

    // console.log('existingUser ', users);
    // if (users.otp === otp) {
    //     const hashedPassword = await bcrypt.hash(password, 10);
    //     const role = 'Administrator';
    //     users.role = role;
    //     users.isSuperAdmin = true;
    //     users.password = hashedPassword;
    //     users.createdAt = new Date();
    //     users.isOnboarded = false;
    //     users.createdBy = email.toLowerCase();
    //     await users.save();
    //     return new Response(JSON.stringify(users), { status: 200 });
    // }

    // return new Response(JSON.stringify({ message: 'Wrong OTP!' }), { status: 500 });

}