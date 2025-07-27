const express = require('express');
const router = express.Router();
const passport = require('passport');
const { signup, login, getProfile, logout, googleCallback } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.post('/logout', logout);
router.get('/check-auth', protect, (req, res) => {
  res.json({ success: true, user: { id: req.user.id, email: req.user.email, username: req.user.username, role: req.user.role } });
});
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), googleCallback);
module.exports = router;
