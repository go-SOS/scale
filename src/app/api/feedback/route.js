import dbConnect from "@/db/config/dbConnect";
import Feedback from "@/db/models/feedback";
import nodemailer from "nodemailer";
// import { getServerSession } from "next-auth/next";
// import { NextRequest, NextResponse } from "next/server";
// import { options } from "@/app/api/auth/[...nextauth]/options.ts";

dbConnect();


async function connectToEmail(name, email, feedback, rating) {

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
        secure: true,
    });

    const htmlContent = `
    <h2>Feedback Received</h2>
    <p>Here are the details:</p>
    <ul style="margin-left: 20px;">
        <li><strong>Full Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Feedback:</strong> ${feedback}</li>
        <li><strong>Rating:</strong> ${rating}</li>
    </ul>
`;
    // Email content
    const mailOptions = {
        from: 'team@scale.ac',
        to: 'devpraveenkr@gmail.com, herespankaj@gmail.com',
        subject: 'Scale Feeback Received',
        html: htmlContent,
    };

    // Send mail
    await transporter.sendMail(mailOptions);
}


export async function POST(request) {
    // const session = await getServerSession(options);
    // if (!session) {
    //     return NextResponse.json(
    //         { message: "Not Authenticated!" },
    //         {
    //             status: 401,
    //         }
    //     );
    // }

    const { name, email, feedback, rating } = await request.json();


    // const existingUser = await Feedback.findOne({ email });

    // console.log('existingUser ', existingUser);
    // if (!existingUser) {
    //     return new Response(JSON.stringify({ error: 'Email not found!' }), { status: 409 });
    // }

    // If user is created successfully, return a success message
    const users = await Feedback.create({
        fullName: name,
        email: email,
        feedback: feedback,
        rating: rating,
        createdBy: email,
        createdAt: new Date()
    });

    // Send OTP to the provided email
    await connectToEmail(
        name,
        email,
        feedback,
        rating,
    );


    return new Response(JSON.stringify(users), { status: 200 });

}