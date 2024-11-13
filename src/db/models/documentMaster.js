import mongoose from 'mongoose';
const { Schema } = mongoose;

const documentMasterSchema = new Schema({
    userId: { type: String, required: true },
    organization: String,
    organizationUrl: String,
    organizationId: String,
    documents: mongoose.Schema.Types.Mixed,
    owner: String,
    createdBy: String,
    lastModifiedBy: String,
    createdAt: Date,
    updatedAt: Date
});

export default mongoose.models.DocumentMaster || mongoose.model('DocumentMaster', documentMasterSchema);