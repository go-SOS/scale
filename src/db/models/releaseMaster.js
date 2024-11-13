import mongoose from 'mongoose';
const { Schema } = mongoose;

const releaseMasterSchema = new Schema({
    userId: { type: String, required: true },
    organization: String,
    organizationUrl: String,
    organizationId: String,
    releases: mongoose.Schema.Types.Mixed,
    owner: String,
    createdBy: String,
    lastModifiedBy: String,
    createdAt: Date,
    updatedAt: Date
});

export default mongoose.models.ReleaseMaster || mongoose.model('ReleaseMaster', releaseMasterSchema);