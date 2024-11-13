import mongoose from 'mongoose';
const { Schema } = mongoose;

const sprintMasterSchema = new Schema({
    userId: { type: String, required: true },
    organization: String,
    organizationUrl: String,
    organizationId: String,
    sprints: mongoose.Schema.Types.Mixed,
    owner: String,
    createdBy: String,
    lastModifiedBy: String,
    createdAt: Date,
    updatedAt: Date
});

export default mongoose.models.SprintMaster || mongoose.model('SprintMaster', sprintMasterSchema);