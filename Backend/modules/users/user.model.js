const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    // unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  Role: {
    type: String,
    required: true,
    enum: ['admin', 'Cashier', 'barista']
  },
  photoUrl: { 
    type: String 
  },
  resetOTP: {
    type: String,
  }, // OTP for password reset
  otpExpires: {
    type: Date,
  }, // OTP expiration time
});

module.exports = mongoose.model("User", userSchema);
