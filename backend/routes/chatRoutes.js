const express = require('express');
const router = express.Router();
const {
  getUserChat,
  sendMessage,
  getAllChats,
  replyToChat,
  markAsRead,
  markAsReadByAdmin,
  updateChatStatus,
  editMessage,
  deleteMessage,
  sendEmoji,
  sendVoiceMessage,
  editAdminReply,
  deleteAdminReply,
  clearChat,
  clearChatAdmin,
  setUserTyping,
  setAdminTyping
} = require('../controllers/chatController');
const { protect, admin } = require('../middleware/authMiddleware');

// User routes
router.use(protect);
router.get('/', getUserChat);
router.post('/message', sendMessage);
router.put('/message/:messageId', editMessage);
router.delete('/message/:messageId', deleteMessage);
router.post('/emoji', sendEmoji);
router.post('/voice', sendVoiceMessage);
router.put('/read', markAsRead);
router.delete('/clear', clearChat);
// Typing indicators
router.post('/typing', setUserTyping);

// Admin routes
router.get('/admin/all', admin, getAllChats);
router.post('/admin/reply/:chatId', admin, replyToChat);
router.put('/admin/reply/:chatId/:messageId', admin, editAdminReply);
router.delete('/admin/reply/:chatId/:messageId', admin, deleteAdminReply);
router.put('/admin/status/:chatId', admin, updateChatStatus);
router.put('/admin/read/:chatId', admin, markAsReadByAdmin);
router.delete('/admin/clear/:chatId', admin, clearChatAdmin);
// Admin typing indicators
router.post('/admin/typing/:chatId', admin, setAdminTyping);

module.exports = router;