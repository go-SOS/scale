import mongoose from 'mongoose';
const { Schema } = mongoose;


const projectSchema = new Schema({
    userId: { type: String, required: true },
    organization: String,
    organizationUrl: String,
    organizationId: String,
    owner: String,
    name: String,
    projectName: String,
    projectSlug: String,
    createdBy: String,
    lastModifiedBy: String,
    createdAt: Date,
    updatedAt: Date
});

export default mongoose.models.Project || mongoose.model('Project', projectSchema);