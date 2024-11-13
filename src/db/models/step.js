import mongoose from 'mongoose';
const { Schema } = mongoose;


const stepSchema = new Schema({
    userId: { type: String, required: true },
    organization: String,
    organizationUrl: String,
    organizationId: String,
    owner: String,
    name: { type: String, required: true },
    type: String,
    projectName: String,
    projectSlug: String,
    sprintId: String,
    createdBy: String,
    lastModifiedBy: String,
    createdAt: Date,
    updatedAt: Date
});

export default mongoose.models.Step || mongoose.model('Step', stepSchema);