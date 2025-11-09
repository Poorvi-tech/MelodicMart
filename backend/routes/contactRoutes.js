const express = require('express');
const router = express.Router();
const { sendContactForm, getAllMessages, getMessageById, replyToMessage } = require('../controllers/contactController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', sendContactForm);

// Admin routes
router.route('/messages')
  .get(protect, admin, getAllMessages);

router.route('/messages/:id')
  .get(protect, admin, getMessageById)
  .post(protect, admin, replyToMessage);

module.exports = router;