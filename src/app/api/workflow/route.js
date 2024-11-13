import dbConnect from "@/db/config/dbConnect";
import Workflow from "@/db/models/workflow";
import { getServerSession } from "next-auth/next";
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

    try {
        const formData = await request.nextUrl.searchParams;
        const id = formData.get('id');
        const slug = formData.get('slug');
        const name = formData.get('name');
        const query = { organizationId: session.data.organizationId };
        if (id) {
            query._id = new ObjectId(id);
        }
        if (slug) {
            query.projectSlug = slug;
        }
        if (name) {
            query.name = name;
        }
        const records = await Workflow.find(query).sort({ createdAt: -1 });
        return new Response(JSON.stringify(records), { status: 200 });

    } catch (error) {
        console.error('Error fetching workflow:', error);
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
    try {
        const workflowData = await request.json();

        workflowData.userId = session.data._id;
        workflowData.createdAt = new Date();
        workflowData.organization = session.data.organization;
        workflowData.organizationId = session.data.organizationId;

        await Workflow.create(workflowData);

        const formData = await request.nextUrl.searchParams;
        const id = formData.get('id');
        const slug = formData.get('slug');
        const name = formData.get('name');
        const query = { organizationId: session.data.organizationId };
        if (id) {
            query._id = new ObjectId(id);
        }
        if (slug) {
            query.projectSlug = slug;
        }
        if (name) {
            query.name = name;
        }
        const records = await Workflow.find(query).sort({ createdAt: -1 });
        return new Response(JSON.stringify(records), { status: 200 });
    } catch (error) {
        console.error('Error creating workflow:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
        });
    }
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
        const deletedWorkflows = await Workflow.deleteMany({ _id: { $in: ids } });

        if (!deletedWorkflows || deletedWorkflows.deletedCount === 0) {
            return new Response(JSON.stringify({
                success: false,
                status: 400,
                data: ids
            }));
        }

        const formData = await request.nextUrl.searchParams;
        const id = formData.get('id');
        const slug = formData.get('slug');
        const name = formData.get('name');
        const query = { organizationId: session.data.organizationId };
        if (id) {
            query._id = new ObjectId(id);
        }
        if (slug) {
            query.projectSlug = slug;
        }
        if (name) {
            query.name = name;
        }
        const records = await Workflow.find(query).sort({ createdAt: -1 });
        return new Response(JSON.stringify(records), { status: 200 });
    } catch (error) {
        console.error('Error deleting workflow settings:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
        });
    }
}

export async function PUT(request) {
    const session = await getServerSession(options)
    if (!session) {
        return new Response(JSON.stringify({
            message: 'Not Authenticated!',
            status: 400,
        }));
    }
    try {
        const formData = await request.nextUrl.searchParams;
        const id = formData.get('id');
        const slug = formData.get('slug');
        const name = formData.get('name');

        const workflowData = await request.json();
        const { _id, ...updateData } = workflowData;

        await Workflow.findOneAndUpdate({ organizationId: session.data.organizationId, name: name }, updateData, {
            new: true,
            runValidators: true,
        });


        const query = { organizationId: session.data.organizationId };
        if (id) {
            query._id = new ObjectId(id);
        }
        if (slug) {
            query.projectSlug = slug;
        }
        if (name) {
            query.name = name;
        }
        const records = await Workflow.find(query).sort({ createdAt: -1 });
        return new Response(JSON.stringify(records), { status: 200 });
    } catch (error) {
        console.error('Error updating workflow:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
        });
    }
}
