import mongoose from 'mongoose';
const { Schema } = mongoose;


const sprintSchema = new Schema({
    userId: { type: String, required: true },
    organization: String,
    organizationUrl: String,
    organizationId: String,
    owner: String,
    name: String,
    summary: String,
    type: String,
    backlogType: String,
    backlogTypeName: String,
    projectName: String,
    projectSlug: String,
    createdBy: String,
    lastModifiedBy: String,
    createdAt: Date,
    updatedAt: Date
});

export default mongoose.models.Sprint || mongoose.model('Sprint', sprintSchema);