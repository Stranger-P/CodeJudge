const User = require('../models/User');

const getUsers = async (req, res) => {
  const { role, email } = req.query;
  try {
    const query = {};
    if (role) query.role = role;
    if (email) query.email = { $regex: email, $options: 'i' };
    const users = await User.find(query).select('email username role createdAt');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateUserRole = async (req, res) => {
  const { username, role } = req.body;
  // console.log(username, role);
  try {
    if (!['student', 'problem-setter', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (username === req.user.username && role !== 'admin') {
      return res.status(400).json({ message: 'Cannot demote yourself' });
    }
    user.role = role;
    await user.save();
    res.json({ message: 'Role updated', user: { id: user._id, email: user.email, username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getUsers, updateUserRole };