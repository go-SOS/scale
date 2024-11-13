import mongoose from 'mongoose';
const { Schema } = mongoose;

const memberMasterSchema = new Schema({
    userId: { type: String, required: true },
    organization: String,
    organizationUrl: String,
    organizationId: String,
    members: mongoose.Schema.Types.Mixed,
    owner: String,
    createdBy: String,
    lastModifiedBy: String,
    createdAt: Date,
    updatedAt: Date
});

export default mongoose.models.MemberMaster || mongoose.model('MemberMaster', memberMasterSchema);