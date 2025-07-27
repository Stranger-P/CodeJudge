const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Assuming your Mongoose model is here
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
// GET all users
router.get('/', authMiddleware,
roleMiddleware(['admin']),
async (req, res) => {
  try {
    // console.log('hello');
    const users = await User.find({}); // exclude password & __v
    // console.log(users[0]);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch userssss' });
  }
});

// PUT: update user role
router.put('/:id/role', authMiddleware,
roleMiddleware(['admin']),
 async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  // console.log(id);
  // console.log(role);
  try {
    await User.findByIdAndUpdate(id, { role });
    res.json({ success: true, message: 'Role updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update role' });
  }
});

// DELETE: remove user
router.delete('/:id', authMiddleware,
roleMiddleware(['admin']),
 async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
