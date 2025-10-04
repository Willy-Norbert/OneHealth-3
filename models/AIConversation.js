const mongoose = require('mongoose');

const AIConversationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  conversationId: { type: String, required: true, unique: true },
  title: { type: String, default: 'New conversation' },
}, { timestamps: true });

AIConversationSchema.index({ user: 1, updatedAt: -1 });

module.exports = mongoose.model('AIConversation', AIConversationSchema);










