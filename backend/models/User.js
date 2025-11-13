const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'India' }
  },
  bio: {
    type: String,
    maxlength: 500
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  avatar: {
    type: String,
    default: ''
  },
  // OTP fields for email verification
  emailVerificationOTP: {
    type: String
  },
  emailVerificationOTPExpires: {
    type: Date
  },
  // OTP fields for password reset
  passwordResetOTP: {
    type: String
  },
  passwordResetOTPExpires: {
    type: Date
  },
  // Settings fields
  notifications: {
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    orderUpdates: { type: Boolean, default: true },
    productUpdates: { type: Boolean, default: true },
    promotionalEmails: { type: Boolean, default: false },
    newsletter: { type: Boolean, default: true }
  },
  privacy: {
    profileVisibility: { type: String, enum: ['public', 'friends', 'private'], default: 'public' },
    activityStatus: { type: Boolean, default: true },
    searchVisibility: { type: Boolean, default: true }
  },
  display: {
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
    language: { type: String, default: 'en' },
    fontSize: { type: String, enum: ['small', 'medium', 'large', 'xlarge'], default: 'medium' },
    animations: { type: Boolean, default: true }
  },
  communication: {
    preferredContact: { type: String, enum: ['email', 'sms', 'phone'], default: 'email' },
    timezone: { type: String, default: 'Asia/Kolkata' },
    newsletter: { type: Boolean, default: true },
    productUpdates: { type: Boolean, default: true },
    marketingCommunications: { type: Boolean, default: false },
    supportUpdates: { type: Boolean, default: true }
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

// Add Temporary Registration model for storing pending registrations
const tempRegistrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    trim: true
  },
  emailVerificationOTP: {
    type: String,
    required: true
  },
  emailVerificationOTPExpires: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Create index to automatically delete expired documents after 15 minutes
tempRegistrationSchema.index({ emailVerificationOTPExpires: 1 }, { expireAfterSeconds: 900 });

module.exports.TempRegistration = mongoose.model('TempRegistration', tempRegistrationSchema);
