import { ObjectId } from 'mongodb';
import { MongoClient } from 'mongodb';
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { options } from "@/app/api/auth/[...nextauth]/options.ts";
import nodemailer from "nodemailer";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const url = process.env.MONGODB_URL;
const dbName = 'scaledb';
const collectionName = 'members';
const userCollectionName = 'users';

let client;
let db;
let collection;
let userCollection;

async function connectToDatabase() {
    if (!client) {
        client = await MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db = client.db(dbName);
        collection = db.collection(collectionName);
        userCollection = db.collection(userCollectionName);
    }
}

async function connectToEmail(email, projectName) {

    await connectToDatabase();
    const session = await getServerSession(options);

    const user = await userCollection.findOne({ email });

    if (!user) {
        throw new Error('User not found');
    }

    const token = crypto.randomBytes(20).toString('hex');
    const expiresInMs = 3 * 24 * 60 * 60 * 1000;  //3 days
    const resetPasswordExpires = new Date(Date.now() + expiresInMs);

    // Convert to ISO string
    const resetPasswordExpiresISO = resetPasswordExpires.toISOString();

    // Update the user's document with the token and expiration time
    const updateResult = await userCollection.updateOne(
        { email },
        {
            $set: {
                resetPasswordToken: token,
                resetPasswordExpires: new Date(resetPasswordExpiresISO)
            }
        }
    );

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
        secure: true,
    });

    // Email content
    const mailOptions = {
        from: 'team@scale.ac',
        to: email,
        subject: `Request from ${session?.data?.fullName} to Join ${session.data.organization} on Scale`,
        html: `
   <div style="text-align: center;">
    <table width="448px" border="0" cellspacing="0" cellpadding="0" style="margin: auto; color: rgb(34, 34, 34); font-family: Arial, Helvetica, sans-serif; font-size: 0px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;">
        <tbody>
            <tr>
                <td class="m_-1463397402471218279center" style="margin: 0px; padding-top: 30px; padding-bottom: 30px; color: rgb(68, 68, 68); font-family: Arial, Arial, sans-serif; font-size: 30px; line-height: 40px; font-weight: 300;">
                    Welcome to Scale!
                </td>
            </tr>
            <tr>
                <td class="m_-1463397402471218279center" style="margin: 0px; padding-bottom: 26px; color: rgb(102, 102, 102); font-family: Arial, sans-serif; font-size: 20px; line-height: 30px; min-width: auto !important;">
                    Your team member has requested you to join Scale to work on a project with them. <br><br>Please click on the button below to reset password and start collaborating.
                </td>
            </tr>
            <tr>
                <td align="left" style="margin: 0px;">
                    <table border="0" cellspacing="0" cellpadding="0">
                        <tbody>
                            <tr>
                                <td style="margin: 0px; color: rgb(255, 255, 255); background: rgb(58, 12, 163); border-radius: 5px; font-family: Arial, Arial, sans-serif; font-size: 14px; line-height: 18px; font-weight: 500; padding: 12px 25px;">
                                    <a href="${process.env.NEXTAUTH_URL}/reset/${token}" target="_blank" style="color: rgb(255, 255, 255); text-decoration: none;">
                                        <span style="color: rgb(255, 255, 255); text-decoration: none;">Reset Password</span>
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
             <tr>
                <td style="margin: 0px; padding-bottom: 26px; color: rgb(102, 102, 102); font-family: Arial, sans-serif; font-size: 20px; line-height: 30px;">
                    Or copy and paste this link to reset password: <br/> 
                    ${process.env.NEXTAUTH_URL}/reset/${token}
                </td>
            </tr>
            <tr>
                <td class="m_-1463397402471218279center" style="margin: 0px; padding-top: 30px; padding-bottom: 30px; color: rgb(68, 68, 68); font-family: Arial, Arial, sans-serif; font-size: 20px; line-height: 30px; font-weight: 300;">
                    If you did not expect this invitation, please ignore this email.
                </td>
            </tr>
        </tbody>
    </table>
</div>

        `,
    };

    // Send mail
    await transporter.sendMail(mailOptions);
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
        const id = formData.get('id');
        const query = { organizationId: session.data.organizationId };
        // console.log('id ', id);
        if (id) {
            query._id = new ObjectId(id);
        }
        if (slug) {
            query.projectSlug = slug;
        }

        const adminQuery = { organizationId: session.data.organizationId }
        const members = await collection.find(query).sort({ createdAt: -1 }).toArray();
        const allMembers = await collection.find(adminQuery).sort({ createdAt: -1 }).toArray();

        adminQuery.isSuperAdmin = true;
        const admins = await collection.find(adminQuery).sort({ createdAt: -1 }).toArray();
        const filteredMembers = allMembers.filter(member =>
            member.projects?.some(project => project.slug === slug) && member.isSuperAdmin !== true
        );
        const combinedArray = [...filteredMembers, ...admins];
        if (id) {
            return new Response(JSON.stringify(members), { status: 200 });
        } else {
            return new Response(JSON.stringify(combinedArray), { status: 200 });
        }

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
    console.log('session ', session);
    try {
        await connectToDatabase();
        const contactData = await request.json();
        contactData.createdAt = new Date();
        contactData.organization = session.data.organization;
        contactData.organizationId = session.data.organizationId;

        // console.log('contactData ', contactData);

        // Check for existing email
        const existingContact = await collection.findOne({ email: { $regex: new RegExp(`^${contactData.email}$`, 'i') } });
        if (existingContact) {
            return new Response(JSON.stringify({ error: 'Email already exists' }), { status: 409 });
        }

        const result = await collection.insertOne(contactData);

        // creating user
        const userEmail = contactData.email;
        const existingUser = await userCollection.findOne({ userEmail });

        // console.log('existingUser ', existingUser);
        if (existingUser) {
            return new Response(JSON.stringify({ error: 'Email is already taken' }), { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(contactData.organizationId, 10);
        const role = contactData.role;

        const users = await userCollection.insertOne({
            timeZone: session.data.timeZone,
            dateFormat: session.data.dateFormat,
            password: hashedPassword,
            email: contactData.email,
            role: contactData.role,
            organization: session.data.organization,
            fullName: contactData.fullName,
            projects: contactData.projects,
            isOnboarded: true,
            organizationId: session.data.organizationId,
            createdBy: session.data.email,
            createdAt: new Date()
        });

        const formData = await request.nextUrl.searchParams;
        const slug = formData.get('slug');
        const id = formData.get('id');
        const query = { organizationId: session.data.organizationId };
        console.log('id ', id);
        if (id) {
            query._id = new ObjectId(id);
        }
        if (slug) {
            query.projectSlug = slug;
        }

        const adminQuery = { organizationId: session.data.organizationId }
        const allMembers = await collection.find(adminQuery).sort({ createdAt: -1 }).toArray();

        adminQuery.isSuperAdmin = true;
        const admins = await collection.find(adminQuery).sort({ createdAt: -1 }).toArray();
        const filteredMembers = allMembers.filter(member =>
            member.projects?.some(project => project.slug === slug) && member.isSuperAdmin !== true
        );
        const combinedArray = [...filteredMembers, ...admins];

        if (contactData?.isInvited) {
            connectToEmail(contactData.email, contactData.projectName);
        }

        return new Response(JSON.stringify(combinedArray), { status: 200 });
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
        const { _id, email, ...updateData } = await request.json();

        console.log('object ', new ObjectId(_id));
        // Ensure createdAt is not modified during update
        delete updateData.createdAt;
        updateData.updatedAt = new Date();

        const updatedContact = collection.findOneAndUpdate({ _id: new ObjectId(_id) }, { $set: updateData }, function (err, doc) {
            if (err) {
                throw err;
            }
            else {
                console.log("Updated");

            }
        });

        const updatedUser = userCollection.findOneAndUpdate({ email: email }, { $set: updateData }, function (err, doc) {
            if (err) {
                throw err;
            }
            else {
                console.log("Updated");

            }
        });

        const formData = await request.nextUrl.searchParams;
        const slug = formData.get('slug');
        const id = formData.get('id');
        const query = { organizationId: session.data.organizationId };
        console.log('id ', id);
        if (id) {
            query._id = new ObjectId(id);
        }
        if (slug) {
            query.projectSlug = slug;
        }

        const adminQuery = { organizationId: session.data.organizationId }
        const allMembers = await collection.find(adminQuery).sort({ createdAt: -1 }).toArray();

        adminQuery.isSuperAdmin = true;
        const admins = await collection.find(adminQuery).sort({ createdAt: -1 }).toArray();
        const filteredMembers = allMembers.filter(member =>
            member.projects?.some(project => project.slug === slug) && member.isSuperAdmin !== true
        );
        const combinedArray = [...filteredMembers, ...admins];

        return new Response(JSON.stringify(combinedArray), { status: 200 });
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
        const adminEmail = session?.data?.email;

        const users = await collection.find(
            { _id: { $in: convertedIds } },
            { projection: { email: 1, role: 1 } }
        ).toArray();
        const emails = users.map(user => user.email);
        // console.log('Users:', emails);

        const adminIdExists = users.some(user => user.email === adminEmail && user.role === 'Administrator');
        if (adminIdExists) {
            return NextResponse.json(
                { message: "Unable to Delete Administrator!" },
                {
                    status: 401,
                }
            );
        } else {
            const deletedrecords = await collection.deleteMany({ _id: { $in: convertedIds } });

            const deletedUserRecords = await userCollection.deleteMany({ email: { $in: emails } });

            if (!deletedrecords || deletedrecords.deletedCount === 0) {
                return new Response(JSON.stringify({
                    success: false,
                    status: 404,
                    data: ids
                }));
            }
            const formData = await request.nextUrl.searchParams;
            const slug = formData.get('slug');
            const id = formData.get('id');
            const query = { organizationId: session.data.organizationId };
            // console.log('id ', id);
            if (id) {
                query._id = new ObjectId(id);
            }
            if (slug) {
                query.projectSlug = slug;
            }

            const adminQuery = { organizationId: session.data.organizationId }
            const allMembers = await collection.find(adminQuery).sort({ createdAt: -1 }).toArray();
    
            adminQuery.isSuperAdmin = true;
            const admins = await collection.find(adminQuery).sort({ createdAt: -1 }).toArray();
            const filteredMembers = allMembers.filter(member =>
                member.projects?.some(project => project.slug === slug) && member.isSuperAdmin !== true
            );
            const combinedArray = [...filteredMembers, ...admins];

            return new Response(JSON.stringify(combinedArray), { status: 200 });
        }


    } catch (error) {
        console.error('Error deleting records:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
        });
    }
}
