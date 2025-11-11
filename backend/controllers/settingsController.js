const User = require('../models/User');

// @desc    Get user settings
// @route   GET /api/settings
// @access  Private
exports.getUserSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      notifications: user.notifications || {},
      privacy: user.privacy || {},
      display: user.display || {},
      communication: user.communication || {}
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user settings
// @route   PUT /api/settings
// @access  Private
exports.updateUserSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user fields
    const { notifications, privacy, display, communication } = req.body;
    
    if (notifications) {
      user.notifications = { ...user.notifications, ...notifications };
    }
    
    if (privacy) {
      user.privacy = { ...user.privacy, ...privacy };
    }
    
    if (display) {
      user.display = { ...user.display, ...display };
    }
    
    if (communication) {
      user.communication = { ...user.communication, ...communication };
    }
    
    await user.save();
    
    res.json({
      notifications: user.notifications,
      privacy: user.privacy,
      display: user.display,
      communication: user.communication
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update notification preferences
// @route   PUT /api/settings/notifications
// @access  Private
exports.updateNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.notifications = { ...user.notifications, ...req.body };
    
    await user.save();
    
    res.json(user.notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update privacy settings
// @route   PUT /api/settings/privacy
// @access  Private
exports.updatePrivacy = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.privacy = { ...user.privacy, ...req.body };
    
    await user.save();
    
    res.json(user.privacy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update display preferences
// @route   PUT /api/settings/display
// @access  Private
exports.updateDisplay = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.display = { ...user.display, ...req.body };
    
    await user.save();
    
    res.json(user.display);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update communication preferences
// @route   PUT /api/settings/communication
// @access  Private
exports.updateCommunication = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.communication = { ...user.communication, ...req.body };
    
    await user.save();
    
    res.json(user.communication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Change password
// @route   POST /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user._id).select('+password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if current password is correct
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Check if new password is different
    if (currentPassword === newPassword) {
      return res.status(400).json({ message: 'New password must be different from current password' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Enable/disable two-factor authentication
// @route   PUT /api/auth/two-factor
// @access  Private
exports.updateTwoFactor = async (req, res) => {
  try {
    const { enabled } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // In a real implementation, you would set up 2FA here
    // For now, we'll just store the preference
    user.twoFactorEnabled = enabled;
    
    await user.save();
    
    res.json({ 
      message: `Two-factor authentication ${enabled ? 'enabled' : 'disabled'} successfully`,
      twoFactorEnabled: user.twoFactorEnabled
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Export user data
// @route   GET /api/settings/export-data
// @access  Private
exports.exportData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // In a real implementation, you would generate and send a data export file
    // For now, we'll just send a success message
    res.json({ 
      message: 'Data export requested. You will receive an email with your data shortly.',
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Export chat history
// @route   GET /api/settings/export-chat
// @access  Private
exports.exportChatHistory = async (req, res) => {
  try {
    // In a real implementation, you would fetch and export chat history
    // For now, we'll just send a success message
    res.json({ 
      message: 'Chat history export requested. You will receive an email with your chat data shortly.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete account
// @route   DELETE /api/auth/delete-account
// @access  Private
exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    
    const user = await User.findById(req.user._id).select('+password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if password is correct
    if (!(await user.matchPassword(password))) {
      return res.status(400).json({ message: 'Password is incorrect' });
    }
    
    // In a real implementation, you would send a confirmation email
    // For now, we'll just send a success message
    await User.findByIdAndDelete(req.user._id);
    
    res.json({ message: 'Account deletion requested. You will receive an email to confirm this action.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};