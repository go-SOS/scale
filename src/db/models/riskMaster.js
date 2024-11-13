import mongoose from 'mongoose';
const { Schema } = mongoose;

const riskMasterSchema = new Schema({
    userId: { type: String, required: true },
    organization: String,
    organizationUrl: String,
    organizationId: String,
    risks: mongoose.Schema.Types.Mixed,
    owner: String,
    createdBy: String,
    lastModifiedBy: String,
    createdAt: Date,
    updatedAt: Date
});

export default mongoose.models.RiskMaster || mongoose.model('RiskMaster', riskMasterSchema);