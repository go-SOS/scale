import mongoose from 'mongoose';
const { Schema } = mongoose;

const roadmapMasterSchema = new Schema({
    userId: { type: String, required: true },
    organization: String,
    organizationUrl: String,
    organizationId: String,
    roadmaps: mongoose.Schema.Types.Mixed,
    owner: String,
    createdBy: String,
    lastModifiedBy: String,
    createdAt: Date,
    updatedAt: Date
});

export default mongoose.models.RoadmapMaster || mongoose.model('RoadmapMaster', roadmapMasterSchema);