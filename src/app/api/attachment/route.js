import { ObjectId } from 'mongodb';
import { MongoClient } from 'mongodb';
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { options } from "@/app/api/auth/[...nextauth]/options.ts";
import aws from 'aws-sdk';

const url = process.env.MONGODB_URL;
const dbName = 'scaledb';
const collectionName = 'attachments'; // Added collection name

let client;
let db;
let collection;

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

async function connectToDatabase() {
    if (!client) {
        client = await MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db = client.db(dbName);
        collection = db.collection(collectionName);
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
        const summaryId = formData.get('summaryId');
        const query = { organizationId: session.data.organizationId };
        // console.log('id ', id);
        if (summaryId) {
            query.summaryId = summaryId;
        }
        if (slug) {
            query.projectSlug = slug;
        }

        const records = await collection.find(query).toArray();
        return new Response(JSON.stringify(records), { status: 200 });
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
    try {
        await connectToDatabase();
        const contactData = await request.formData();

        // Convert FormData to plain object
        const data = {};
        contactData.forEach((value, key) => {
            data[key] = value;
        });

        // Get the file from the FormData
        const file = contactData.get('file');

        if (!file) {
            return new Response(JSON.stringify({ error: 'No file uploaded' }), {
                status: 400,
            });
        }

        // const fileSize = file.size;
        // data.size = fileSize;

        // Retrieve the file size in bytes
        const fileSizeInBytes = file.size;
        // Convert the file size to MB
        const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
        // Add the file size in MB to the data object
        data.size = fileSizeInMB.toFixed(2) + 'MB';

        // Convert the Blob to a Buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Upload the file to S3
        const uploadParams = {
            Bucket: process.env.AWS_S3_IMG_BUCKET_NAME,
            Key: `${data.summary}-${Date.now()}`, // You can customize the file key here
            Body: buffer,
            ContentType: data.fileType,
        };

        const uploadResult = await s3.upload(uploadParams).promise();

        // Add the S3 file URL to the data object
        data.fileUrl = uploadResult.Location;
        data.documentLink = uploadResult.Location;
        data.createdAt = new Date();
        data.uploadedDate = new Date();
        data.organization = session.data.organization;
        data.organizationId = session.data.organizationId;

        // Insert the data into the collection
        const result = await collection.insertOne(data);

        const formData = await request.nextUrl.searchParams;
        const slug = formData.get('slug');
        const summaryId = formData.get('summaryId');
        const query = { organizationId: session.data.organizationId };
        // console.log('id ', id);
        if (summaryId) {
            query.summaryId = summaryId;
        }
        if (slug) {
            query.projectSlug = slug;
        }

        const records = await collection.find(query).toArray();
        return new Response(JSON.stringify(records), { status: 200 });

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
            } else {
                console.log("Updated");
                return new Response("Updated", {
                    status: 200,
                });
            }
        });
        const formData = await request.nextUrl.searchParams;
        const slug = formData.get('slug');
        const summaryId = formData.get('summaryId');
        const query = { organizationId: session.data.organizationId };
        // console.log('id ', id);
        if (summaryId) {
            query.summaryId = summaryId;
        }
        if (slug) {
            query.projectSlug = slug;
        }

        const records = await collection.find(query).toArray();
        return new Response(JSON.stringify(records), { status: 200 });
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

        const deletedrecords = await collection.deleteMany({ _id: { $in: convertedIds } });

        if (!deletedrecords || deletedrecords.deletedCount === 0) {
            return new Response(JSON.stringify({
                success: false,
                status: 404,
                data: ids
            }));
        }
        const formData = await request.nextUrl.searchParams;
        const slug = formData.get('slug');
        const summaryId = formData.get('summaryId');
        const query = { organizationId: session.data.organizationId };
        // console.log('id ', id);
        if (summaryId) {
            query.summaryId = summaryId;
        }
        if (slug) {
            query.projectSlug = slug;
        }

        const records = await collection.find(query).toArray();
        return new Response(JSON.stringify(records), { status: 200 });
    } catch (error) {
        console.error('Error deleting records:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
        });
    }
}
