import mongoose from 'mongoose';
const { Schema } = mongoose;

const todoMasterSchema = new Schema({
    userId: { type: String, required: true },
    organization: String,
    organizationUrl: String,
    organizationId: String,
    todos: mongoose.Schema.Types.Mixed,
    owner: String,
    createdBy: String,
    lastModifiedBy: String,
    createdAt: Date,
    updatedAt: Date
});

export default mongoose.models.TodoMaster || mongoose.model('TodoMaster', todoMasterSchema);