const Chat = require('../models/Chat');

// @desc    Get or create chat for user
// @route   GET /api/chat
// @access  Private
exports.getUserChat = async (req, res) => {
  try {
    let chat = await Chat.findOne({ user: req.user._id })
      .sort('-lastMessageAt');

    if (!chat) {
      chat = await Chat.create({
        user: req.user._id,
        userName: req.user.name,
        userEmail: req.user.email,
        messages: []
      });
    }

    // Filter messages based on cleared status and deleted status
    let filteredMessages = chat.messages;
    
    // Filter by cleared timestamp
    if (chat.clearedByUserAt) {
      filteredMessages = filteredMessages.filter(msg => new Date(msg.timestamp) > new Date(chat.clearedByUserAt));
    }
    
    // Filter out messages deleted for the current user
    filteredMessages = filteredMessages.filter(msg => {
      // If deleted for everyone, don't show to anyone
      if (msg.deletedFor === 'everyone') {
        return false;
      }
      // If deleted for current user specifically
      if (msg.deletedForUser) {
        return false;
      }
      // Otherwise, show the message
      return true;
    });

    // Update message status to "delivered" when user loads chat
    // (This means messages have been delivered to the user)
    let messagesUpdated = false;
    filteredMessages.forEach(msg => {
      if (msg.sender === 'admin' && msg.status === 'sent') {
        msg.status = 'delivered';
        messagesUpdated = true;
      }
    });

    // If any messages were updated, save the chat
    if (messagesUpdated) {
      chat.markModified('messages');
      await chat.save();
    }

    // Create a copy of the chat object with filtered messages
    const chatObject = chat.toObject();
    chatObject.messages = filteredMessages;

    res.json({
      success: true,
      chat: chatObject
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Send message
// @route   POST /api/chat/message
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    let chat = await Chat.findOne({ user: req.user._id });

    if (!chat) {
      chat = await Chat.create({
        user: req.user._id,
        userName: req.user.name,
        userEmail: req.user.email,
        messages: []
      });
    }

    // Add message with initial status
    const newMessage = {
      sender: 'user',
      message: message.trim(),
      read: false,
      status: 'sent' // Message is sent but not yet delivered
    };

    chat.messages.push(newMessage);

    chat.lastMessageAt = new Date();
    chat.unreadCount += 1;
    chat.status = 'active';

    await chat.save();

    res.json({
      success: true,
      message: 'Message sent successfully',
      chat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all chats (Admin only)
// @route   GET /api/chat/admin/all
// @access  Private/Admin
exports.getAllChats = async (req, res) => {
  try {
    const { status } = req.query;

    let query = {};
    if (status) {
      query.status = status;
    }

    const chats = await Chat.find(query)
      .populate('user', 'name email')
      .sort('-lastMessageAt');

    // For each chat, filter messages based on cleared status for admin and deleted status
    const filteredChats = chats.map(chat => {
      let filteredMessages = chat.messages;
      
      // Filter by cleared timestamp
      if (chat.clearedByAdminAt) {
        filteredMessages = filteredMessages.filter(msg => new Date(msg.timestamp) > new Date(chat.clearedByAdminAt));
      }
      
      // Filter out messages deleted for the current user (admin)
      filteredMessages = filteredMessages.filter(msg => {
        // If deleted for everyone, don't show to anyone
        if (msg.deletedFor === 'everyone') {
          return false;
        }
        // If deleted for current user specifically
        if (msg.deletedForAdmin) {
          return false;
        }
        // Otherwise, show the message
        return true;
      });
      
      return {
        ...chat.toObject(),
        messages: filteredMessages
      };
    });

    // Update message status to "delivered" when admin loads chats
    // (This means messages have been delivered to the admin)
    for (const chat of chats) {
      let messagesUpdated = false;
      chat.messages.forEach(msg => {
        if (msg.sender === 'user' && msg.status === 'sent') {
          msg.status = 'delivered';
          messagesUpdated = true;
        }
      });
      
      if (messagesUpdated) {
        chat.markModified('messages');
        await chat.save();
      }
    }

    const totalUnread = filteredChats.reduce((sum, chat) => sum + chat.unreadCount, 0);

    res.json({
      success: true,
      count: filteredChats.length,
      totalUnread,
      chats: filteredChats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Reply to chat (Admin only)
// @route   POST /api/chat/admin/reply/:chatId
// @access  Private/Admin
exports.replyToChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Add admin reply with initial status
    const newMessage = {
      sender: 'admin',
      message: message.trim(),
      read: false,
      status: 'sent' // Message is sent but not yet delivered
    };

    chat.messages.push(newMessage);

    chat.lastMessageAt = new Date();
    chat.unreadCount = 0; // Reset unread count when admin replies

    await chat.save();

    res.json({
      success: true,
      message: 'Reply sent successfully',
      chat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Edit admin reply
// @route   PUT /api/chat/admin/reply/:chatId/:messageId
// @access  Private/Admin
exports.editAdminReply = async (req, res) => {
  try {
    const { chatId, messageId } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Find the message
    const messageIndex = chat.messages.findIndex(msg => msg._id.toString() === messageId);
    
    if (messageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    const msg = chat.messages[messageIndex];
    
    // Check if admin can edit (only admin messages)
    if (msg.sender !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only edit admin messages'
      });
    }

    // Check if message is within edit time limit (1 minute)
    const timeDiff = (new Date() - new Date(msg.timestamp)) / 1000 / 60; // in minutes
    if (timeDiff > 1) {
      return res.status(400).json({
        success: false,
        message: 'Message can only be edited within 1 minute of sending'
      });
    }

    // Update message
    msg.message = message.trim();
    msg.edited = true;
    chat.markModified('messages');

    await chat.save();

    res.json({
      success: true,
      message: 'Message updated successfully',
      chat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete admin reply
// @route   DELETE /api/chat/admin/reply/:chatId/:messageId
// @access  Private/Admin
exports.deleteAdminReply = async (req, res) => {
  try {
    const { chatId, messageId } = req.params;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Find the message
    const messageIndex = chat.messages.findIndex(msg => msg._id.toString() === messageId);
    
    if (messageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Remove the message
    chat.messages.splice(messageIndex, 1);
    chat.markModified('messages');
    
    await chat.save();

    res.json({
      success: true,
      message: 'Message deleted successfully',
      chat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Mark messages as read
// @route   PUT /api/chat/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const chat = await Chat.findOne({ user: req.user._id });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Mark all admin messages as read and update status
    chat.messages.forEach(msg => {
      if (msg.sender === 'admin' && !msg.read) {
        msg.read = true;
        msg.status = 'read';
      }
    });

    await chat.save();

    res.json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Mark messages as read by admin
// @route   PUT /api/chat/admin/read/:chatId
// @access  Private/Admin
exports.markAsReadByAdmin = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Mark all user messages as read by admin and update status
    chat.messages.forEach(msg => {
      if (msg.sender === 'user' && !msg.read) {
        msg.read = true;
        msg.status = 'read';
      }
    });

    // Reset unread count
    chat.unreadCount = 0;

    await chat.save();

    res.json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update chat status (Admin only)
// @route   PUT /api/chat/admin/status/:chatId
// @access  Private/Admin
exports.updateChatStatus = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { status } = req.body;

    if (!['active', 'resolved', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { status },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    res.json({
      success: true,
      message: 'Status updated',
      chat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Edit message
// @route   PUT /api/chat/message/:messageId
// @access  Private
exports.editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const chat = await Chat.findOne({ user: req.user._id });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Find the message
    const messageIndex = chat.messages.findIndex(msg => msg._id.toString() === messageId);
    
    if (messageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    const msg = chat.messages[messageIndex];
    
    // Check if user can edit (only their own messages and within 1 minute)
    if (msg.sender !== 'user') {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own messages'
      });
    }

    const timeDiff = (new Date() - new Date(msg.timestamp)) / 1000 / 60; // in minutes
    if (timeDiff > 1) {
      return res.status(400).json({
        success: false,
        message: 'Message can only be edited within 1 minute of sending'
      });
    }

    // Update message
    msg.message = message.trim();
    msg.edited = true;
    chat.markModified('messages');

    await chat.save();

    res.json({
      success: true,
      message: 'Message updated successfully',
      chat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete message
// @route   DELETE /api/chat/message/:messageId
// @access  Private
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { deleteFor } = req.body; // 'me' or 'everyone'

    const chat = await Chat.findOne({ user: req.user._id });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Find the message
    const messageIndex = chat.messages.findIndex(msg => msg._id.toString() === messageId);
    
    if (messageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    const msg = chat.messages[messageIndex];
    
    // Check if user can delete for everyone (only their own messages)
    if (deleteFor === 'everyone' && msg.sender !== 'user') {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own messages for everyone'
      });
    }

    if (deleteFor === 'everyone') {
      // Delete for everyone - mark as deleted
      msg.deleted = true;
      msg.deletedFor = 'everyone';
      msg.message = 'This message was deleted';
    } else {
      // Delete for me only - mark as deleted for current user
      // Users can delete any message "for me" - both sent and received
      if (req.user && req.user.role === 'admin') {
        msg.deletedForAdmin = true;
      } else {
        msg.deletedForUser = true;
      }
      msg.message = 'This message was deleted for you';
    }
    
    chat.markModified('messages');
    await chat.save();

    res.json({
      success: true,
      message: 'Message deleted successfully',
      chat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Send emoji
// @route   POST /api/chat/emoji
// @access  Private
exports.sendEmoji = async (req, res) => {
  try {
    const { emoji } = req.body;

    if (!emoji) {
      return res.status(400).json({
        success: false,
        message: 'Emoji is required'
      });
    }

    let chat = await Chat.findOne({ user: req.user._id });

    if (!chat) {
      chat = await Chat.create({
        user: req.user._id,
        userName: req.user.name,
        userEmail: req.user.email,
        messages: []
      });
    }

    // Add emoji message
    chat.messages.push({
      sender: 'user',
      message: emoji,
      messageType: 'emoji',
      read: false
    });

    chat.lastMessageAt = new Date();
    chat.unreadCount += 1;
    chat.status = 'active';

    await chat.save();

    res.json({
      success: true,
      message: 'Emoji sent successfully',
      chat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Send voice message
// @route   POST /api/chat/voice
// @access  Private
exports.sendVoiceMessage = async (req, res) => {
  try {
    const { voiceData } = req.body; // This would be base64 encoded audio data

    if (!voiceData) {
      return res.status(400).json({
        success: false,
        message: 'Voice data is required'
      });
    }

    let chat = await Chat.findOne({ user: req.user._id });

    if (!chat) {
      chat = await Chat.create({
        user: req.user._id,
        userName: req.user.name,
        userEmail: req.user.email,
        messages: []
      });
    }

    // Add voice message
    chat.messages.push({
      sender: 'user',
      message: voiceData,
      messageType: 'voice',
      read: false
    });

    chat.lastMessageAt = new Date();
    chat.unreadCount += 1;
    chat.status = 'active';

    await chat.save();

    res.json({
      success: true,
      message: 'Voice message sent successfully',
      chat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Clear chat messages for user only
// @route   DELETE /api/chat/clear
// @access  Private
exports.clearChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({ user: req.user._id });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Instead of clearing messages, just mark the clear time for the user
    chat.clearedByUserAt = new Date();
    
    await chat.save();

    res.json({
      success: true,
      message: 'Chat cleared successfully for you only',
      chat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Clear chat messages for admin only
// @route   DELETE /api/chat/admin/clear/:chatId
// @access  Private/Admin
exports.clearChatAdmin = async (req, res) => {
  try {
    const { chatId } = req.params;
    
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Instead of clearing messages, just mark the clear time for the admin
    chat.clearedByAdminAt = new Date();
    
    await chat.save();

    res.json({
      success: true,
      message: 'Chat cleared successfully for you only',
      chat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Add new controller methods for typing indicators

// @desc    Set user typing status
// @route   POST /api/chat/typing
// @access  Private
exports.setUserTyping = async (req, res) => {
  try {
    const { isTyping } = req.body;
    const chat = await Chat.findOne({ user: req.user._id });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    chat.isUserTyping = isTyping;
    chat.typingUserId = req.user._id;
    
    // If user stops typing, clear the typing user ID
    if (!isTyping) {
      chat.typingUserId = null;
    }

    await chat.save();

    res.json({
      success: true,
      message: `User typing status set to ${isTyping}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Set admin typing status
// @route   POST /api/chat/admin/typing/:chatId
// @access  Private/Admin
exports.setAdminTyping = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { isTyping } = req.body;
    
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    chat.isAdminTyping = isTyping;
    
    await chat.save();

    res.json({
      success: true,
      message: `Admin typing status set to ${isTyping}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
