const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  // Temporary user data held until OTP is verified
  userData: {
    name: String,
    password: String,
    role: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // Auto-delete after 10 minutes (TTL index)
  },
});

module.exports = mongoose.model('OTP', otpSchema);
