import mongoose from 'mongoose';
const { Schema } = mongoose;


const feedbackSchema = new Schema({
    feedback: String,
    rating: String,
    fullName: String,
    email: String,
    phone: String,
    organization: String,
    organizationUrl: String,
    organizationId: String,
    timeZone: String,
    dateFormat: String,
    role: String,
    userRole: String,
    domainExpertise: String,
    companySize: String,
    isOnboarded: Boolean,
    password: String,
    createdBy: String,
    lastModifiedBy: String,
    createdAt: Date,
    updatedAt: Date
});

export default mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);