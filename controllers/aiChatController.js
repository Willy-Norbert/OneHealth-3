const AIChatMessage = require('../models/AIChatMessage');
const AIConversation = require('../models/AIConversation');

// Save a batch of messages (user and assistant) for a conversation
exports.saveMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const { conversationId, messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ status: 'error', message: 'No messages to save' });
    }
    // Ensure conversation exists or create it
    if (conversationId) {
      const firstUserMessage = messages.find(m => m.role === 'user');
      const autoTitle = firstUserMessage?.content?.slice(0, 60) || 'New conversation';
      await AIConversation.updateOne(
        { user: userId, conversationId },
        { $setOnInsert: { title: autoTitle }, $set: { updatedAt: new Date() } },
        { upsert: true }
      );
    }
    const docs = messages.map(m => ({
      user: userId,
      conversationId,
      role: m.role,
      service: m.service,
      content: m.content,
      analysis: m.analysis
    }));
    await AIChatMessage.insertMany(docs);
    res.status(201).json({ status: 'success', message: 'Messages saved' });
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message });
  }
};

// Get recent messages for current user (optionally by conversation)
exports.getHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { conversationId, limit = 50 } = req.query;
    const query = { user: userId };
    if (conversationId) query.conversationId = conversationId;
    const items = await AIChatMessage.find(query).sort({ createdAt: -1 }).limit(parseInt(limit));
    res.status(200).json({ status: 'success', data: items });
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message });
  }
};

// List distinct conversations
exports.listConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const convs = await AIConversation.find({ user: userId }).sort({ updatedAt: -1 }).lean();
    res.status(200).json({ status: 'success', data: convs });
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message });
  }
};

// Create a new conversation
exports.createConversation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { title, conversationId } = req.body;
    if (!conversationId) return res.status(400).json({ status: 'error', message: 'conversationId is required' });
    const doc = await AIConversation.create({ user: userId, conversationId, title: title || 'New conversation' });
    res.status(201).json({ status: 'success', data: doc });
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message });
  }
};

// Rename conversation
exports.renameConversation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params; // conversationId
    const { title } = req.body;
    const updated = await AIConversation.findOneAndUpdate({ user: userId, conversationId: id }, { title, updatedAt: new Date() }, { new: true });
    if (!updated) return res.status(404).json({ status: 'error', message: 'Conversation not found' });
    res.status(200).json({ status: 'success', data: updated });
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message });
  }
};

// Delete conversation (and its messages)
exports.deleteConversation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params; // conversationId
    await AIConversation.deleteOne({ user: userId, conversationId: id });
    await AIChatMessage.deleteMany({ user: userId, conversationId: id });
    res.status(200).json({ status: 'success', message: 'Conversation deleted' });
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message });
  }
};


