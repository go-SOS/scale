import mongoose from 'mongoose';
const { Schema } = mongoose;

const projectMasterSchema = new Schema({
    userId: { type: String, required: true },
    organization: String,
    organizationUrl: String,
    organizationId: String,
    projects: mongoose.Schema.Types.Mixed,
    owner: String,
    createdBy: String,
    lastModifiedBy: String,
    createdAt: Date,
    updatedAt: Date
});

export default mongoose.models.ProjectMaster || mongoose.model('ProjectMaster', projectMasterSchema);