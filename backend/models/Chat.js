const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['user', 'admin'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  messageType: {
    type: String,
    enum: ['text', 'voice', 'emoji'],
    default: 'text'
  },
  read: {
    type: Boolean,
    default: false
  },
  edited: {
    type: Boolean,
    default: false
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedFor: {
    type: String,
    enum: ['none', 'sender', 'everyone'],
    default: 'none'
  },
  // Track specifically who deleted the message for themselves
  deletedForUser: {
    type: Boolean,
    default: false
  },
  deletedForAdmin: {
    type: Boolean,
    default: false
  },
  // WhatsApp-like message status tracking
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  messages: [messageSchema],
  status: {
    type: String,
    enum: ['active', 'resolved', 'pending'],
    default: 'active'
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  unreadCount: {
    type: Number,
    default: 0
  },
  // Add fields to track cleared status for user and admin separately
  clearedByUserAt: {
    type: Date,
    default: null
  },
  clearedByAdminAt: {
    type: Date,
    default: null
  },
  // Typing indicators
  isUserTyping: {
    type: Boolean,
    default: false
  },
  isAdminTyping: {
    type: Boolean,
    default: false
  },
  typingUserId: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for quick lookup
chatSchema.index({ user: 1 });
chatSchema.index({ status: 1, lastMessageAt: -1 });

module.exports = mongoose.model('Chat', chatSchema);