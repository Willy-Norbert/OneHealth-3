const AIChatMessage = require('../models/AIChatMessage');
const AIConversation = require('../models/AIConversation');

// Save a batch of messages (user and assistant) for a conversation
exports.saveMessages = async (req, res) => {
  try {
    console.log('💾 [AI CHAT] Saving messages...');
    console.log('   User ID:', req.user?._id);
    console.log('   Conversation ID:', req.body?.conversationId);
    console.log('   Messages count:', req.body?.messages?.length);
    
    const userId = req.user._id;
    const { conversationId, messages } = req.body;
    
    if (!Array.isArray(messages) || messages.length === 0) {
      console.error('❌ [AI CHAT] No messages to save');
      return res.status(400).json({ status: 'error', message: 'No messages to save' });
    }
    
    // Ensure conversation exists or create it
    if (conversationId) {
      const firstUserMessage = messages.find(m => m.role === 'user');
      // Extract text from content if it's a React element or object
      let titleContent = '';
      if (firstUserMessage?.content) {
        if (typeof firstUserMessage.content === 'string') {
          titleContent = firstUserMessage.content;
        } else if (typeof firstUserMessage.content === 'object' && firstUserMessage.content?.props?.children) {
          // Try to extract text from React element
          const children = firstUserMessage.content.props.children;
          if (typeof children === 'string') {
            titleContent = children;
          } else if (Array.isArray(children)) {
            titleContent = children.map(c => typeof c === 'string' ? c : '').join(' ').trim();
          }
        }
      }
      const autoTitle = (titleContent || firstUserMessage?.content || 'New conversation').toString().slice(0, 60);
      console.log('📝 [AI CHAT] Upserting conversation:', conversationId, autoTitle);
      try {
        await AIConversation.updateOne(
          { user: userId, conversationId },
          { 
            $setOnInsert: { 
              user: userId,
              conversationId,
              title: autoTitle,
              createdAt: new Date()
            }, 
            $set: { 
              updatedAt: new Date(),
              title: autoTitle // Update title if it changes
            } 
          },
          { upsert: true }
        );
        console.log('✅ [AI CHAT] Conversation upserted successfully');
      } catch (convErr) {
        console.error('❌ [AI CHAT] Error upserting conversation:', convErr.message);
        // Continue anyway - messages can still be saved
      }
    }
    
    // Prepare messages for saving
    const docs = messages.map(m => {
      // Extract content text from React element if needed
      let contentText = '';
      if (m.content) {
        if (typeof m.content === 'string') {
          contentText = m.content;
        } else if (typeof m.content === 'object' && m.content?.props?.children) {
          // Try to extract text from React element
          const children = m.content.props.children;
          if (typeof children === 'string') {
            contentText = children;
          } else if (Array.isArray(children)) {
            contentText = children.map(c => typeof c === 'string' ? c : '').join(' ').trim();
          } else if (typeof children === 'object' && children?.props) {
            // Deep extract from nested React elements
            const extractText = (obj) => {
              if (typeof obj === 'string') return obj;
              if (Array.isArray(obj)) return obj.map(extractText).join(' ');
              if (obj && typeof obj === 'object' && obj.props && obj.props.children) return extractText(obj.props.children);
              return '';
            };
            contentText = extractText(children);
          }
        } else {
          contentText = String(m.content);
        }
      }
      
      return {
        user: userId,
        conversationId: conversationId || undefined,
        role: m.role,
        service: m.service || 'general-chat',
        content: contentText || '',
        analysis: m.analysis || ''
      };
    }).filter(d => d.content && d.content.trim().length > 0); // Only save non-empty messages
    
    if (docs.length === 0) {
      console.warn('⚠️  [AI CHAT] No valid messages to save after filtering');
      return res.status(400).json({ status: 'error', message: 'No valid messages to save' });
    }
    
    console.log('💾 [AI CHAT] Inserting', docs.length, 'messages...');
    console.log('   Messages:', docs.map(d => ({ role: d.role, service: d.service, contentLength: d.content.length })));
    try {
      await AIChatMessage.insertMany(docs);
      console.log('✅ [AI CHAT] Messages saved successfully');
    } catch (insertErr) {
      console.error('❌ [AI CHAT] Error inserting messages:', insertErr.message);
      // If it's a duplicate key error, try updating instead
      if (insertErr.code === 11000 || insertErr.message.includes('duplicate')) {
        console.log('🔄 [AI CHAT] Duplicate detected, skipping insert');
      } else {
        throw insertErr;
      }
    }
    
    res.status(201).json({ status: 'success', message: 'Messages saved' });
  } catch (e) {
    console.error('❌ [AI CHAT] Error saving messages:', e);
    console.error('   Error message:', e.message);
    console.error('   Error stack:', e.stack);
    res.status(500).json({ status: 'error', message: e.message || 'Failed to save messages' });
  }
};

// Get recent messages for current user (optionally by conversation)
exports.getHistory = async (req, res) => {
  try {
    console.log('📖 [AI CHAT] Getting history...');
    console.log('   User ID:', req.user?._id);
    console.log('   Conversation ID:', req.query?.conversationId);
    console.log('   Limit:', req.query?.limit);
    
    const userId = req.user._id;
    const { conversationId, limit = 50 } = req.query;
    const query = { user: userId };
    if (conversationId) {
      query.conversationId = conversationId;
    }
    
    console.log('📖 [AI CHAT] Query:', query);
    const items = await AIChatMessage.find(query).sort({ createdAt: 1 }).limit(parseInt(limit));
    console.log(`✅ [AI CHAT] Found ${items.length} messages`);
    
    res.status(200).json({ status: 'success', data: items });
  } catch (e) {
    console.error('❌ [AI CHAT] Error getting history:', e.message);
    console.error('   Error stack:', e.stack);
    res.status(500).json({ status: 'error', message: e.message });
  }
};

// List distinct conversations
exports.listConversations = async (req, res) => {
  try {
    console.log('📋 [AI CHAT] Listing conversations...');
    console.log('   User ID:', req.user?._id);
    
    const userId = req.user._id;
    const convs = await AIConversation.find({ user: userId }).sort({ updatedAt: -1 }).lean();
    
    // Get message count for each conversation
    const convsWithCounts = await Promise.all(convs.map(async (conv) => {
      const messageCount = await AIChatMessage.countDocuments({ 
        user: userId, 
        conversationId: conv.conversationId 
      });
      return { ...conv, messageCount };
    }));
    
    console.log(`✅ [AI CHAT] Found ${convsWithCounts.length} conversations`);
    res.status(200).json({ status: 'success', data: convsWithCounts });
  } catch (e) {
    console.error('❌ [AI CHAT] Error listing conversations:', e.message);
    console.error('   Error stack:', e.stack);
    res.status(500).json({ status: 'error', message: e.message });
  }
};

// Create a new conversation
exports.createConversation = async (req, res) => {
  try {
    console.log('🆕 [AI CHAT] Creating conversation...');
    console.log('   User ID:', req.user?._id);
    console.log('   Conversation ID:', req.body?.conversationId);
    console.log('   Title:', req.body?.title);
    
    const userId = req.user._id;
    const { title, conversationId } = req.body;
    
    if (!conversationId || typeof conversationId !== 'string' || conversationId.trim().length === 0) {
      console.error('❌ [AI CHAT] conversationId is required');
      return res.status(400).json({ status: 'error', message: 'conversationId is required' });
    }
    
    // Check if conversation already exists
    const existing = await AIConversation.findOne({ user: userId, conversationId });
    if (existing) {
      console.log('ℹ️  [AI CHAT] Conversation already exists, updating...');
      const updated = await AIConversation.findOneAndUpdate(
        { user: userId, conversationId },
        { title: title || existing.title || 'New conversation', updatedAt: new Date() },
        { new: true }
      );
      return res.status(200).json({ status: 'success', data: updated });
    }
    
    const doc = await AIConversation.create({ 
      user: userId, 
      conversationId: conversationId.trim(), 
      title: (title || 'New conversation').trim() 
    });
    
    console.log('✅ [AI CHAT] Conversation created successfully');
    res.status(201).json({ status: 'success', data: doc });
  } catch (e) {
    console.error('❌ [AI CHAT] Error creating conversation:', e.message);
    console.error('   Error stack:', e.stack);
    
    // Handle duplicate key error
    if (e.code === 11000 || e.message.includes('duplicate')) {
      console.log('ℹ️  [AI CHAT] Duplicate conversation detected, fetching existing...');
      try {
        const existing = await AIConversation.findOne({ user: req.user._id, conversationId: req.body.conversationId });
        if (existing) {
          return res.status(200).json({ status: 'success', data: existing });
        }
      } catch (fetchErr) {
        console.error('❌ [AI CHAT] Error fetching existing conversation:', fetchErr.message);
      }
    }
    
    res.status(500).json({ status: 'error', message: e.message || 'Failed to create conversation' });
  }
};

// Rename conversation
exports.renameConversation = async (req, res) => {
  try {
    console.log('✏️  [AI CHAT] Renaming conversation...');
    console.log('   User ID:', req.user?._id);
    console.log('   Conversation ID:', req.params?.id);
    console.log('   New title:', req.body?.title);
    
    const userId = req.user._id;
    const { id } = req.params; // conversationId
    const { title } = req.body;
    
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      console.error('❌ [AI CHAT] Title is required');
      return res.status(400).json({ status: 'error', message: 'Title is required' });
    }
    
    const updated = await AIConversation.findOneAndUpdate(
      { user: userId, conversationId: id }, 
      { title: title.trim(), updatedAt: new Date() }, 
      { new: true }
    );
    
    if (!updated) {
      console.warn('⚠️  [AI CHAT] Conversation not found for renaming');
      return res.status(404).json({ status: 'error', message: 'Conversation not found' });
    }
    
    console.log('✅ [AI CHAT] Conversation renamed successfully');
    res.status(200).json({ status: 'success', data: updated });
  } catch (e) {
    console.error('❌ [AI CHAT] Error renaming conversation:', e.message);
    console.error('   Error stack:', e.stack);
    res.status(500).json({ status: 'error', message: e.message || 'Failed to rename conversation' });
  }
};

// Delete conversation (and its messages)
exports.deleteConversation = async (req, res) => {
  try {
    console.log('🗑️  [AI CHAT] Deleting conversation...');
    console.log('   User ID:', req.user?._id);
    console.log('   Conversation ID:', req.params?.id);
    
    const userId = req.user._id;
    const { id } = req.params; // conversationId
    
    // Delete messages first
    const messageDeleteResult = await AIChatMessage.deleteMany({ user: userId, conversationId: id });
    console.log(`   Deleted ${messageDeleteResult.deletedCount} messages`);
    
    // Delete conversation
    const conversationDeleteResult = await AIConversation.deleteOne({ user: userId, conversationId: id });
    
    if (conversationDeleteResult.deletedCount === 0) {
      console.warn('⚠️  [AI CHAT] Conversation not found for deletion');
      return res.status(404).json({ status: 'error', message: 'Conversation not found' });
    }
    
    console.log('✅ [AI CHAT] Conversation deleted successfully');
    res.status(200).json({ status: 'success', message: 'Conversation deleted' });
  } catch (e) {
    console.error('❌ [AI CHAT] Error deleting conversation:', e.message);
    console.error('   Error stack:', e.stack);
    res.status(500).json({ status: 'error', message: e.message || 'Failed to delete conversation' });
  }
};


