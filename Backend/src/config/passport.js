const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,   
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Find user by googleId or email
    let user = await User.findOne({ $or: [{ googleId: profile.id }, { email: profile.emails[0].value }] });
    if (user) {
      // If user exists, update googleId if not set
      if (!user.googleId) {
        user.googleId = profile.id;
        await user.save();
      }
    } else {
      // Create new user
      user = new User({
        googleId: profile.id,
        email: profile.emails[0].value,
        username: profile.displayName.replace(/\s/g, '').toLowerCase() + Math.floor(Math.random() * 1000),
        role: 'student',
      });
      await user.save();
    }
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));