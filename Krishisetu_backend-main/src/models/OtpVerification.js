const mongoose = require('mongoose');

const otpVerificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  otp: {
    type: String,
    required: [true, 'OTP is required'],
    length: [6, 'OTP must be exactly 6 digits'],
    match: [/^\d{6}$/, 'OTP must be 6 digits']
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // Auto delete after 5 minutes (300 seconds)
  }
}, {
  timestamps: true
});

// Create TTL index for automatic deletion after 5 minutes
otpVerificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

module.exports = mongoose.model('OtpVerification', otpVerificationSchema);
