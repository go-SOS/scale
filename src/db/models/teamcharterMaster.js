import mongoose from 'mongoose';
const { Schema } = mongoose;

const teamcharterMasterSchema = new Schema({
    userId: { type: String, required: true },
    organization: String,
    organizationUrl: String,
    organizationId: String,
    teamcharters: mongoose.Schema.Types.Mixed,
    owner: String,
    createdBy: String,
    lastModifiedBy: String,
    createdAt: Date,
    updatedAt: Date
});

export default mongoose.models.TeamcharterMaster || mongoose.model('TeamcharterMaster', teamcharterMasterSchema);