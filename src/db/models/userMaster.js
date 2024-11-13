import mongoose from 'mongoose';
const { Schema } = mongoose;

const userMasterSchema = new Schema({
    userId: { type: String, required: true },
    organization: String,
    organizationUrl: String,
    organizationId: String,
    users: mongoose.Schema.Types.Mixed,
    owner: String,
    createdBy: String,
    lastModifiedBy: String,
    createdAt: Date,
    updatedAt: Date
});

export default mongoose.models.UserMaster || mongoose.model('UserMaster', userMasterSchema);