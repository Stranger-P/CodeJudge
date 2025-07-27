const jwt = require('jsonwebtoken');
const User = require('../models/User');
const protect = async (req, res, next) => {
  const token = req.cookies.token;
  // console.log(req.user);
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    // console.log('hello');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // Fetch full user from DB and attach role
    // Example: Fetch user from database
    const user = await User.findById(decoded.id);
    req.user.role = user.role;
    req.user._id = user._id; 
    // console.log(req.user._id);
    next();
  } catch (error) {
    // console.log(error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = protect;
