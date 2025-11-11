const express = require('express');
const router = express.Router();
const {
  getUserSettings,
  updateUserSettings,
  updateNotifications,
  updatePrivacy,
  updateDisplay,
  updateCommunication,
  changePassword,
  updateTwoFactor,
  exportData,
  exportChatHistory,
  deleteAccount
} = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');

// Settings routes
router.route('/')
  .get(protect, getUserSettings)
  .put(protect, updateUserSettings);

router.put('/notifications', protect, updateNotifications);
router.put('/privacy', protect, updatePrivacy);
router.put('/display', protect, updateDisplay);
router.put('/communication', protect, updateCommunication);

// Auth-related settings
router.post('/change-password', protect, changePassword);
router.put('/two-factor', protect, updateTwoFactor);
router.get('/export-data', protect, exportData);
router.get('/export-chat', protect, exportChatHistory);
router.delete('/delete-account', protect, deleteAccount);

module.exports = router;