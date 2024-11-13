import mongoose from 'mongoose';
const { Schema } = mongoose;

const timesheetMasterSchema = new Schema({
    userId: { type: String, required: true },
    organization: String,
    organizationUrl: String,
    organizationId: String,
    timesheets: mongoose.Schema.Types.Mixed,
    owner: String,
    createdBy: String,
    lastModifiedBy: String,
    createdAt: Date,
    updatedAt: Date
});

export default mongoose.models.TimesheetMaster || mongoose.model('TimesheetMaster', timesheetMasterSchema);