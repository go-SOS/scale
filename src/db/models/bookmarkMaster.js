import mongoose from 'mongoose';
const { Schema } = mongoose;

const bookmarkMasterSchema = new Schema({
    userId: { type: String, required: true },
    organization: String,
    organizationUrl: String,
    organizationId: String,
    bookmarks: mongoose.Schema.Types.Mixed,
    owner: String,
    createdBy: String,
    lastModifiedBy: String,
    createdAt: Date,
    updatedAt: Date
});

export default mongoose.models.BookmarkMaster || mongoose.model('BookmarkMaster', bookmarkMasterSchema);