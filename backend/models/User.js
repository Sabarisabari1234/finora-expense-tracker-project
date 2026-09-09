const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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

  isEmailVerified: {
  type: Boolean,
  default: false,
  },

  verificationToken: {
    type: String,
  },
  
  verificationTokenExpires: {
    type: Date,
  },

  resetPasswordToken:{
    type: String,
  },

  resetPasswordExpires: {
    type: Date,
  },
  
});

const User = mongoose.model("User", userSchema);

module.exports = User;