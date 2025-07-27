const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};
const signup = async (req, res) => {
  const { email, username, password } = req.body;
  try {
    // Validate input
    if (!email || !username || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or username already taken' });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, username, password: hashedPassword });
    await user.save();
    const token = generateToken(user._id, user.role);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24*360000, 
      path: '/',
    });
    // console.log(user);
    res.json({ success: 'true' ,message: 'signUp and Login successfully', user: { id: user._id, email: user.email, username: user.username } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  // console.log(email);
  try {
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    // Find user
    const user = await User.findOne({ username });
    // console.log(user);
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    // Create JWT
    const token = generateToken(user._id, user.role);
    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24*3600000, 
      path: '/',
    });
    res.json({success: 'true', message: 'Login successful', user: { id: user._id, email: user.email, username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); 
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ success : 'true',user: { id: user._id, email: user.email, username: user.username, role: user.role} });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const logout = async (req, res) => {

  res.cookie('token', '', { maxAge: 0, httpOnly: true, path: '/' });
  res.json({ message: 'Logged out successfully' });
};

const googleCallback = async (req, res) => {
  try {
    const user = req.user;
    const token = generateToken(user._id, user.role);
    res.cookie('token', token, {   
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24*3600000,
      path: '/',
    });
    res.redirect("http://localhost:5173/dashboard") // Redirect to frontend
  } catch (error) {
    res.status(500).json({ message: 'Google auth failed', error: error.message });
  }
};

module.exports = { signup, login, getProfile, logout, googleCallback };