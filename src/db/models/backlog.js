import mongoose from 'mongoose';
const { Schema } = mongoose;


const backlogSchema = new Schema({
    userId: { type: String, required: true },
    organization: String,
    organizationUrl: String,
    organizationId: String,
    owner: String,
    name: String,
    summary: String,
    type: String,
    backlogKey: String,
    backlogType: String,
    workItemType: String,
    backlogTypeName: String,
    projectName: String,
    projectSlug: String,
    sprintId: String,
    createdBy: String,
    lastModifiedBy: String,
    createdAt: Date,
    updatedAt: Date
});

export default mongoose.models.Backlog || mongoose.model('Backlog', backlogSchema);