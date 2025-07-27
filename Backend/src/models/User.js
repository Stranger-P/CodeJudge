const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true },
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String }, // Optional for Google users
  googleId: { type: String, unique: true, sparse: true }, // For Google Auth
  role: { 
    type: String, 
    enum: ['student', 'problem-setter', 'admin'], 
    default: 'student' 
  },
  joined: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);