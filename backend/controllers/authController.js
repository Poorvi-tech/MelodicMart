const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const upload = require('../utils/upload');
const path = require('path');
const fs = require('fs');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create user directly (no email verification)
    const user = await User.create({
      name,
      email,
      password,
      phone,
      isVerified: true // Set as verified by default
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
      token: generateToken(user._id),
      message: 'Registration successful'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (await user.matchPassword(password)) {
      // No need to check email verification anymore
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
        bio: user.bio,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot password - send OTP
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'No account found with this email address' });
    }

    // For simplicity, we'll just send a success message
    // In a real implementation, you would generate and send an OTP
    res.status(200).json({ message: 'Password reset instructions sent to your email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
        bio: user.bio,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        createdAt: user.createdAt
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      user.address = req.body.address || user.address;
      user.bio = req.body.bio || user.bio;
      user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
      user.gender = req.body.gender || user.gender;

      // Handle avatar upload if provided
      if (req.file) {
        // Delete old avatar if exists
        if (user.avatar) {
          const oldAvatarPath = path.join(__dirname, '../../uploads/avatars/', path.basename(user.avatar));
          if (fs.existsSync(oldAvatarPath)) {
            fs.unlinkSync(oldAvatarPath);
          }
        }
        
        // Save new avatar path
        user.avatar = `/uploads/avatars/${req.file.filename}`;
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        role: updatedUser.role,
        isVerified: updatedUser.isVerified,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        dateOfBirth: updatedUser.dateOfBirth,
        gender: updatedUser.gender,
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload user avatar
// @route   POST /api/auth/profile/avatar
// @access  Private
exports.uploadAvatar = async (req, res) => {
  try {
    // Handle file upload with multer
    upload.single('avatar')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const user = await User.findById(req.user._id);

      if (user) {
        // Delete old avatar if exists
        if (user.avatar) {
          const oldAvatarPath = path.join(__dirname, '../../uploads/avatars/', path.basename(user.avatar));
          if (fs.existsSync(oldAvatarPath)) {
            fs.unlinkSync(oldAvatarPath);
          }
        }
        
        // Save new avatar path
        user.avatar = `/uploads/avatars/${req.file.filename}`;
        await user.save();

        res.json({
          message: 'Avatar uploaded successfully',
          avatar: user.avatar
        });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user statistics
// @route   GET /api/auth/profile/stats
// @access  Private
exports.getUserStats = async (req, res) => {
  try {
    // Import models here to avoid circular dependencies
    const Order = require('../models/Order');
    const Wishlist = require('../models/Wishlist');
    
    // Get orders count
    const ordersCount = await Order.countDocuments({ user: req.user._id });
    
    // Get wishlist count
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    const wishlistCount = wishlist ? wishlist.products.length : 0;
    
    // For now, we'll use dummy data for reviews, products viewed, loyalty points, and coupons
    // In a real application, these would be tracked and stored in the database
    const reviewsCount = Math.floor(Math.random() * 10) + 1;
    const productsViewedCount = Math.floor(Math.random() * 100) + 20;
    const loyaltyPointsCount = Math.floor(Math.random() * 500) + 100;
    const couponsCount = Math.floor(Math.random() * 8) + 2;
    
    res.json({
      orders: ordersCount,
      wishlist: wishlistCount,
      reviews: reviewsCount,
      productsViewed: productsViewedCount,
      loyaltyPoints: loyaltyPointsCount,
      coupons: couponsCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};