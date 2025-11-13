const User = require('../models/User');
const { TempRegistration } = require('../models/User'); // Add TempRegistration model
const generateToken = require('../utils/generateToken');
const { sendConfirmationEmail, sendPasswordResetOTP } = require('../utils/emailService');
const upload = require('../utils/upload');
const path = require('path');
const fs = require('fs');

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user exists in database
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Check if there's a pending registration for this email
    const pendingRegistration = await TempRegistration.findOne({ email });
    if (pendingRegistration) {
      // If pending registration exists, remove it (user can restart registration)
      await TempRegistration.deleteOne({ email });
    }

    // Generate OTP for email verification
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Store registration data temporarily in database
    const tempRegistration = await TempRegistration.create({
      name,
      email,
      password,
      phone,
      emailVerificationOTP: otp,
      emailVerificationOTPExpires: otpExpires
    });

    // Send OTP email
    try {
      await sendConfirmationEmail(email, name, otp);
      res.status(201).json({
        email: email,
        message: 'Registration initiated. Please check your email for verification OTP.'
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // If email fails, remove from pending registrations
      await TempRegistration.deleteOne({ email });
      
      // Provide more specific error message based on environment
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        res.status(500).json({ 
          message: 'Email service not configured. Please contact administrator.' 
        });
      } else {
        res.status(500).json({ 
          message: 'Failed to send verification email. Please try again.' 
        });
      }
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP for email verification
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check if there's a pending registration for this email
    const pendingRegistration = await TempRegistration.findOne({ email });
    
    if (!pendingRegistration) {
      // Check if user already exists in database
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(404).json({ message: 'Registration not found. Please register first.' });
      }
      
      // Check if user is already verified
      if (user.isVerified) {
        return res.status(400).json({ message: 'User is already verified' });
      }
      
      // Check if OTP is correct and not expired
      if (user.emailVerificationOTP !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
      
      if (user.emailVerificationOTPExpires < Date.now()) {
        return res.status(400).json({ message: 'OTP has expired' });
      }
      
      // Update user as verified and clear OTP fields
      user.isVerified = true;
      user.emailVerificationOTP = undefined;
      user.emailVerificationOTPExpires = undefined;
      
      await user.save();
      
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        token: generateToken(user._id),
        message: 'Email verified successfully'
      });
    } else {
      // Handle pending registration verification
      
      // Check if OTP is correct and not expired
      if (pendingRegistration.emailVerificationOTP !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
      
      if (pendingRegistration.emailVerificationOTPExpires < Date.now()) {
        return res.status(400).json({ message: 'OTP has expired' });
      }
      
      // Create user in database now that verification is successful
      const user = await User.create({
        name: pendingRegistration.name,
        email: pendingRegistration.email,
        password: pendingRegistration.password,
        phone: pendingRegistration.phone,
        isVerified: true
      });
      
      // Remove from pending registrations
      await TempRegistration.deleteOne({ email });
      
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        token: generateToken(user._id),
        message: 'Email verified successfully'
      });
    }
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if there's a pending registration for this email
    const pendingRegistration = await TempRegistration.findOne({ email });
    
    if (!pendingRegistration) {
      // Check if user exists in database
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Check if user is already verified
      if (user.isVerified) {
        return res.status(400).json({ message: 'User is already verified' });
      }
      
      // Generate new OTP
      const otp = generateOTP();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
      
      // Update user with new OTP
      user.emailVerificationOTP = otp;
      user.emailVerificationOTPExpires = otpExpires;
      
      await user.save();
      
      // Send OTP email
      try {
        await sendConfirmationEmail(email, user.name, otp);
        res.status(200).json({ message: 'OTP resent successfully. Please check your email.' });
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        res.status(500).json({ message: 'Failed to send verification email. Please try again.' });
      }
    } else {
      // Handle pending registration resend
      
      // Generate new OTP
      const otp = generateOTP();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
      
      // Update pending registration with new OTP
      pendingRegistration.emailVerificationOTP = otp;
      pendingRegistration.emailVerificationOTPExpires = otpExpires;
      
      await pendingRegistration.save();
      
      // Send OTP email
      try {
        await sendConfirmationEmail(email, pendingRegistration.name, otp);
        res.status(200).json({ message: 'OTP resent successfully. Please check your email.' });
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        res.status(500).json({ message: 'Failed to send verification email. Please try again.' });
      }
    }
  } catch (error) {
    console.error('Resend OTP error:', error);
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
      // Check if user is verified
      if (!user.isVerified) {
        return res.status(401).json({ message: 'Please verify your email before logging in' });
      }

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

    // Generate OTP for password reset
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Update user with password reset OTP
    user.passwordResetOTP = otp;
    user.passwordResetOTPExpires = otpExpires;

    await user.save();

    // Send password reset OTP email
    try {
      await sendPasswordResetOTP(email, user.name, otp);
      res.status(200).json({ message: 'Password reset OTP sent to your email' });
    } catch (emailError) {
      res.status(500).json({ message: 'Failed to send password reset email. Please try again.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP is correct and not expired
    if (user.passwordResetOTP !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.passwordResetOTPExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Update password
    user.password = newPassword;
    // Clear password reset OTP fields
    user.passwordResetOTP = undefined;
    user.passwordResetOTPExpires = undefined;

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
