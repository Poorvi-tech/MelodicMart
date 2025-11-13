const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  uploadAvatar,
  getUserStats
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../utils/upload');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile);
router.post('/profile/avatar', protect, upload.single('avatar'), uploadAvatar);
router.get('/profile/stats', protect, getUserStats);

module.exports = router;