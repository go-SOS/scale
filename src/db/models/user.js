import mongoose from 'mongoose';
const { Schema } = mongoose;


const userSchema = new Schema({
    fullName: String,
    email: String,
    phone: String,
    organization: String,
    organizationUrl: String,
    organizationId: String,
    otp: String,
    timeZone: String,
    dateFormat: String,
    role: String,
    userRole: String,
    domainExpertise: String,
    companySize: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isOnboarded: Boolean,
    isSuperAdmin: Boolean,
    password: String,
    createdBy: String,
    lastModifiedBy: String,
    createdAt: Date,
    updatedAt: Date
});

export default mongoose.models.User || mongoose.model('User', userSchema);