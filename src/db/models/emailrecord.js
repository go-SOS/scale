import mongoose from 'mongoose';
const { Schema } = mongoose;

const emailRecordSchema = new Schema({
    userId: { type: String, required: true },
    owner: String,
    from: String,
    to: mongoose.Schema.Types.Mixed,
    subject: String,
    message: String,
    organization: String,
    organizationUrl: String,
    organizationId: String,
    cc: String,
    bcc: String,
    reportedBy: String,
    createdBy: String,
    lastModifiedBy: String,
    lastUpdatedDate: String,
    reportedBy: String,
    createdAt: Date,
    updatedAt: Date
});

export default mongoose.models.EmailRecord || mongoose.model('EmailRecord', emailRecordSchema);
