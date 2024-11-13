import mongoose from 'mongoose';
const { Schema } = mongoose;

const stakeholderMasterSchema = new Schema({
    userId: { type: String, required: true },
    organization: String,
    organizationUrl: String,
    organizationId: String,
    stakeholders: mongoose.Schema.Types.Mixed,
    owner: String,
    createdBy: String,
    lastModifiedBy: String,
    createdAt: Date,
    updatedAt: Date
});

export default mongoose.models.StakeholderMaster || mongoose.model('StakeholderMaster', stakeholderMasterSchema);