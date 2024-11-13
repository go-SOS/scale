import mongoose from 'mongoose';
const { Schema } = mongoose;

const organizationSchema = new Schema({
    userId: { type: String, required: true },
    owner: String,
    organization: { type: String, required: true, unique: true },
    organizationUrl: String,
    organizationId: String,
    teamMember: mongoose.Schema.Types.Mixed,
    status: String,
    createdBy: String,
    lastModifiedBy: String,
    createdAt: Date,
    updatedAt: Date
});

export default mongoose.models.Organization || mongoose.model('Organization', organizationSchema);
