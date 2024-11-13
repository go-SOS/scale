import mongoose from 'mongoose';
const { Schema } = mongoose;

const workflowSchema = new Schema({
    userId: { type: String, required: true },
    name: String,
    stages: mongoose.Schema.Types.Mixed,
    organization: String,
    organizationUrl: String,
    organizationId: String,
    createdBy: String,
    lastModifiedBy: String,
    createdAt: Date,
    updatedAt: Date
});

export default mongoose.models.Workflow || mongoose.model('Workflow', workflowSchema);
