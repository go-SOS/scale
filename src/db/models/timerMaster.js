import mongoose from 'mongoose';
const { Schema } = mongoose;

const timerMasterSchema = new Schema({
    userId: { type: String, required: true },
    organization: String,
    organizationUrl: String,
    organizationId: String,
    timers: mongoose.Schema.Types.Mixed,
    owner: String,
    createdBy: String,
    lastModifiedBy: String,
    createdAt: Date,
    updatedAt: Date
});

export default mongoose.models.TimerMaster || mongoose.model('TimerMaster', timerMasterSchema);