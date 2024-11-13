import mongoose from 'mongoose';
const { Schema } = mongoose;

const teamMasterSchema = new Schema({
    userId: { type: String, required: true },
    organization: String,
    organizationUrl: String,
    organizationId: String,
    teams: mongoose.Schema.Types.Mixed,
    owner: String,
    createdBy: String,
    lastModifiedBy: String,
    createdAt: Date,
    updatedAt: Date
});

export default mongoose.models.TeamMaster || mongoose.model('TeamMaster', teamMasterSchema);