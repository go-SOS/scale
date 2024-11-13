import mongoose from 'mongoose';
const { Schema } = mongoose;

const calendarSchema = new Schema({
    userId: { type: String, required: true },
    organization: String,
    organizationUrl: String,
    organizationId: String,
    calendars: mongoose.Schema.Types.Mixed,
    owner: String,
    createdBy: String,
    lastModifiedBy: String,
    createdAt: Date,
    updatedAt: Date
});

export default mongoose.models.CalendarMaster || mongoose.model('CalendarMaster', calendarSchema);