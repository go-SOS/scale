import mongoose from 'mongoose';
const { Schema } = mongoose;

const retrospectiveMasterSchema = new Schema({
    userId: { type: String, required: true },
    organization: String,
    organizationUrl: String,
    organizationId: String,
    retrospectives: mongoose.Schema.Types.Mixed,
    owner: String,
    createdBy: String,
    lastModifiedBy: String,
    createdAt: Date,
    updatedAt: Date
});

export default mongoose.models.RetrospectiveMaster || mongoose.model('RetrospectiveMaster', retrospectiveMasterSchema);