import mongoose from 'mongoose';
const { Schema } = mongoose;

const assumptionMasterSchema = new Schema({
    userId: { type: String, required: true },
    organization: String,
    organizationUrl: String,
    organizationId: String,
    assumptions: mongoose.Schema.Types.Mixed,
    owner: String,
    createdBy: String,
    lastModifiedBy: String,
    createdAt: Date,
    updatedAt: Date
});

export default mongoose.models.AssumptionMaster || mongoose.model('AssumptionMaster', assumptionMasterSchema);