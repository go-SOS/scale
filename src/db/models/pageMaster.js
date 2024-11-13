import mongoose from 'mongoose';
const { Schema } = mongoose;

const pageMasterSchema = new Schema({
    userId: { type: String, required: true },
    organization: String,
    organizationUrl: String,
    organizationId: String,
    pages: mongoose.Schema.Types.Mixed,
    owner: String,
    createdBy: String,
    lastModifiedBy: String,
    createdAt: Date,
    updatedAt: Date
});

export default mongoose.models.PageMaster || mongoose.model('PageMaster', pageMasterSchema);