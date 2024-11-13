import mongoose from 'mongoose';
const { Schema } = mongoose;

const holidayMasterSchema = new Schema({
    userId: { type: String, required: true },
    organization: String,
    organizationUrl: String,
    organizationId: String,
    holidays: mongoose.Schema.Types.Mixed,
    owner: String,
    createdBy: String,
    lastModifiedBy: String,
    createdAt: Date,
    updatedAt: Date
});

export default mongoose.models.HolidayMaster || mongoose.model('HolidayMaster', holidayMasterSchema);