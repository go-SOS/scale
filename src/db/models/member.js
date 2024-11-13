import mongoose from 'mongoose';
const { Schema } = mongoose;


const memberSchema = new Schema({
    fullName: String,
    email: String,
    phone: String,
    phoneNumber: String,
    organization: String,
    organizationUrl: String,
    organizationId: String,
    otp: String,
    timeZone: String,
    dateFormat: String,
    projectName: String,
    projectSlug: String,
    teamName: String,
    memberName: String,
    isInvited: Boolean,
    isJoined: Boolean,
    isSuperAdmin: Boolean,
    role: String,
    userRole: String,
    domainExpertise: String,
    companySize: String,
    availability: String,
    comments: String,
    createdBy: String,
    lastModifiedBy: String,
    createdAt: Date,
    updatedAt: Date
});

export default mongoose.models.Member || mongoose.model('Member', memberSchema);