import mongoose from 'mongoose';
const { Schema } = mongoose;

const backlogMasterSchema = new Schema({
    userId: { type: String, required: true },
    organization: String,
    organizationUrl: String,
    organizationId: String,
    backlogs: mongoose.Schema.Types.Mixed,
    owner: String,
    createdBy: String,
    lastModifiedBy: String,
    createdAt: Date,
    updatedAt: Date
});

export default mongoose.models.BacklogMaster || mongoose.model('BacklogMaster', backlogMasterSchema);