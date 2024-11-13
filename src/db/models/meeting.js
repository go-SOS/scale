import mongoose from 'mongoose';
import { boolean, number } from 'yup';
const { Schema } = mongoose;

const meetingSchema = new Schema({
    userId: { type: String, required: true },
    organization: String,
    organizationUrl: String,
    organizationId: String,
    leadId: String,
    owner: String,
    title: String,
    start: Date,
    end: Date,
    startTime: String,
    endTime: String,
    meetingLink: String,
    meetingName: String,
    meetingLocation: String,
    isMeetingAllDay: Boolean,
    meetingFromDate: String,
    meetingToDate: String,
    meetingDuration: String,
    meetingHost: String,
    meetingRelatedTo: mongoose.Schema.Types.Mixed,
    meetingParticipants: mongoose.Schema.Types.Mixed,
    meetingParticipantsReminder: String,
    meetingDescription: String,
    projectName: String,
    projectSlug: String,
    createdBy: String,
    lastModifiedBy: String,
    createdAt: Date,
    updatedAt: Date
});

export default mongoose.models.Meeting || mongoose.model('Meeting', meetingSchema);
