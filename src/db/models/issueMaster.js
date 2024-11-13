import mongoose from 'mongoose';
const { Schema } = mongoose;

const issueMasterSchema = new Schema({
    userId: { type: String, required: true },
    organization: String,
    organizationUrl: String,
    organizationId: String,
    issues: mongoose.Schema.Types.Mixed,
    owner: String,
    createdBy: String,
    lastModifiedBy: String,
    createdAt: Date,
    updatedAt: Date
});

export default mongoose.models.IssueMaster || mongoose.model('IssueMaster', issueMasterSchema);