import mongoose from 'mongoose';
const { Schema } = mongoose;

const dependencyMasterSchema = new Schema({
    userId: { type: String, required: true },
    organization: String,
    organizationUrl: String,
    organizationId: String,
    dependencies: mongoose.Schema.Types.Mixed,
    owner: String,
    createdBy: String,
    lastModifiedBy: String,
    createdAt: Date,
    updatedAt: Date
});

export default mongoose.models.DependencyMaster || mongoose.model('DependencyMaster', dependencyMasterSchema);