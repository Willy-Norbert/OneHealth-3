const mongoose = require('mongoose');

const AIChatMessageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  conversationId: { type: String, index: true },
  role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
  service: { type: String, enum: ['symptom-checker', 'health-tips', 'prescription-helper'], required: true },
  content: { type: String, required: true },
  analysis: { type: String },
}, { timestamps: true });

AIChatMessageSchema.index({ user: 1, createdAt: -1 });
AIChatMessageSchema.index({ conversationId: 1, createdAt: 1 });

module.exports = mongoose.model('AIChatMessage', AIChatMessageSchema);












