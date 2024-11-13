import nodemailer from "nodemailer";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/db/config/dbConnect";
import EmailRecord from "@/db/models/emailrecord";
import { options } from "@/app/api/auth/[...nextauth]/options.ts";

dbConnect();

export async function GET(request) {
    const session = await getServerSession(options)
    if (!session) {
        return new Response(JSON.stringify({
            message: 'Not Authenticated!',
            status: 400,
        }));
    }
    console.log('session ', session.data._id);

    try {
        const emailRecords = await EmailRecord.find({ userId: session.data._id }).sort({ createdAt: -1 });

        const data = JSON.stringify(emailRecords);
        return new Response(data, {
            status: 200,
        });
    } catch (error) {
        console.error('Error fetching email settings:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
        });
    }
}

export async function POST(request) {
    const session = await getServerSession(options)
    if (!session) {
        return new Response(JSON.stringify({
            message: 'Not Authenticated!',
            status: 400,
        }));
    }
    const contactData = await request.json();

    contactData.userId = session?.data?._id;
    contactData.createdAt = new Date();
    contactData.lastUpdatedDate = new Date().toISOString().split('T')[0];
    contactData.reportedBy = session.data.email;
    contactData.organization = session.data.organization;
    contactData.organizationId = session.data.organizationId;

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
        secure: true,
    });

    const mailData = {
        from: process.env.SMTP_USER,
        to: Array.isArray(contactData?.to) ? contactData?.to.join(", ") : contactData?.to,
        subject: session.data.email + ' from your team has sent you an email.',
        html: `${contactData?.message}<br><br><b>Note: <b/>Please compose a new email to respond directly to the sender.`
    }

    transporter.sendMail(mailData, function (err, info) {
        if (err)
            console.log(err)
        else
            console.log(info);
    })

    // saving sent email
    try {
        const formattedTo = Array.isArray(contactData?.to) ? contactData?.to.join(", ") : contactData?.to;
        contactData.to = formattedTo;

        const emails = await EmailRecord.create(contactData);

        return new Response(JSON.stringify({
            success: true,
            status: 200,
            data: 'Mail sent.'
        }));

    } catch (error) {
        console.error('Error creating task:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
        });
    }
    // saving sent email
}

export async function DELETE(request) {
    const session = await getServerSession(options)
    if (!session) {
        return new Response(JSON.stringify({
            message: 'Not Authenticated!',
            status: 400,
        }));
    }
    try {
        const ids = await request.json();
        const deletedEmails = await EmailRecord.deleteMany({ _id: { $in: ids } });

        if (!deletedEmails || deletedEmails.deletedCount === 0) {
            return new Response(JSON.stringify({
                success: false,
                status: 400,
                data: ids
            }));
        }
        const emailRecords = await EmailRecord.find({ userId: session.data._id }).sort({ createdAt: -1 });

        const emailsdata = JSON.stringify(emailRecords);

        return new Response(emailsdata, {
            status: 200,
        });
    } catch (error) {
        console.error('Error deleting email settings:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
        });
    }
}