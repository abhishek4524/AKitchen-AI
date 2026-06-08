const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authController = require('../controller/authController');
const { protect: authMiddleware } = require('../middleware/auth');

const getSafeReturnTo = (value) => {
  if (typeof value !== 'string' || !value.startsWith('/')) return '/profile';
  if (value.startsWith('//') || value.includes('://')) return '/profile';
  return value;
};

// ============================================================
// PUBLIC AUTH ROUTES
// ============================================================

// Email/Password Registration
router.post('/register', authController.register);

// Email/Password Login
router.post('/login', authController.login);

// Google OAuth
router.get(
  '/google',
  (req, res, next) => {
    const guestId = req.query.guestId;
    if (guestId && req.session) {
      req.session.guestId = guestId;
    }
    if (req.session) {
      req.session.returnTo = getSafeReturnTo(req.query.returnTo);
    }
    next();
  },
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  async (req, res) => {
    try {
      // If a guestId was stored in session, migrate that usage to the user
      const guestId = req.session?.guestId;
      if (guestId) {
        const GuestUsage = require('../models/GuestUsage');
        const guestDoc = await GuestUsage.findOne({ guestId });
        if (guestDoc && guestDoc.usageCount > 0) {
          // add to user's usageCount and remove guest record
          req.user.usageCount = (req.user.usageCount || 0) + guestDoc.usageCount;
          await req.user.save();
          await GuestUsage.deleteOne({ guestId });
        }
        // cleanup session
        delete req.session.guestId;
      }

      const token = jwt.sign(
        { id: req.user._id, email: req.user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5174';
      const returnTo = getSafeReturnTo(req.session?.returnTo);
      if (req.session) {
        delete req.session.returnTo;
      }
      const separator = returnTo.includes('?') ? '&' : '?';
      res.redirect(`${clientUrl}${returnTo}${separator}token=${token}`);
    } catch (err) {
      console.error('Google callback error:', err);
      res.redirect('/');
    }
  }
);

// Request Password Reset
router.post('/forgot-password', authController.requestPasswordReset);

// Reset Password
router.post('/reset-password', authController.resetPassword);

// ============================================================
// PROTECTED AUTH ROUTES (Require JWT Token)
// ============================================================

// Get Current User
router.get('/me', authMiddleware, authController.getCurrentUser);

// Update Profile
router.put('/profile', authMiddleware, authController.updateProfile);

// Change Password
router.post('/change-password', authMiddleware, authController.changePassword);

// Add Password to OAuth User
router.post('/add-password', authMiddleware, authController.addPassword);

module.exports = router;
