const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { auth } = require('../middleware/auth');
const {
  hashPassword,
  verifyPassword,
  generateToken,
  generateOTP,
  saveOTP,
  verifyOTP,
  blacklistToken
} = require('../utils/auth');

const router = express.Router();

// Validation middleware
const validateSignup = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').trim().isLength({ min: 2 }),
  body('lastName').trim().isLength({ min: 2 }),
  body('phone').optional().isMobilePhone('en-IN')
];

const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

const validateOTP = [
  body('phone').isMobilePhone('en-IN'),
  body('otp').isLength({ min: 6, max: 6 }).isNumeric()
];

// Register new user
router.post('/signup', validateSignup, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, firstName, lastName, phone } = req.body;

    // Check if user already exists
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = $1 OR phone = $2',
      [email, phone]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists with this email or phone.' });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const result = await db.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, phone, is_verified) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, first_name, last_name, phone, is_verified',
      [email, passwordHash, firstName, lastName, phone, false]
    );

    const user = result.rows[0];
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        isVerified: user.is_verified
      },
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Registration failed.' });
  }
});

// Login user
router.post('/login', validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const result = await db.query(
      'SELECT id, email, password_hash, first_name, last_name, phone, avatar_url, is_verified, is_active FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(401).json({ error: 'Account is deactivated.' });
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        avatarUrl: user.avatar_url,
        isVerified: user.is_verified
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed.' });
  }
});

// Send OTP for phone verification
router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required.' });
    }

    const otp = generateOTP();
    await saveOTP(phone, otp);

    // In production, integrate with SMS service like Twilio
    console.log(`OTP for ${phone}: ${otp}`);

    res.json({ message: 'OTP sent successfully.' });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP.' });
  }
});

// Verify OTP and login/register
router.post('/verify-otp', validateOTP, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phone, otp, firstName, lastName, email } = req.body;

    // Verify OTP
    const isValidOTP = await verifyOTP(phone, otp);
    if (!isValidOTP) {
      return res.status(400).json({ error: 'Invalid or expired OTP.' });
    }

    // Check if user exists
    let user = await db.query(
      'SELECT id, email, first_name, last_name, phone, avatar_url, is_verified, is_active FROM users WHERE phone = $1',
      [phone]
    );

    if (user.rows.length === 0) {
      // Create new user if doesn't exist
      if (!firstName || !lastName || !email) {
        return res.status(400).json({ error: 'First name, last name, and email are required for new users.' });
      }

      const result = await db.query(
        'INSERT INTO users (email, phone, first_name, last_name, auth_provider, is_verified) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, first_name, last_name, phone, avatar_url, is_verified, is_active',
        [email, phone, firstName, lastName, 'phone', true]
      );

      user = result.rows[0];
    } else {
      user = user.rows[0];
    }

    if (!user.is_active) {
      return res.status(401).json({ error: 'Account is deactivated.' });
    }

    const token = generateToken(user.id);

    res.json({
      message: 'OTP verified successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        avatarUrl: user.avatar_url,
        isVerified: user.is_verified
      },
      token
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'OTP verification failed.' });
  }
});

// Google OAuth login/register
router.post('/google', async (req, res) => {
  try {
    const { googleId, email, firstName, lastName, avatarUrl } = req.body;

    if (!googleId || !email || !firstName || !lastName) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Check if user exists
    let user = await db.query(
      'SELECT id, email, first_name, last_name, phone, avatar_url, is_verified, is_active FROM users WHERE google_id = $1 OR email = $2',
      [googleId, email]
    );

    if (user.rows.length === 0) {
      // Create new user
      const result = await db.query(
        'INSERT INTO users (google_id, email, first_name, last_name, avatar_url, auth_provider, is_verified) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, email, first_name, last_name, phone, avatar_url, is_verified, is_active',
        [googleId, email, firstName, lastName, avatarUrl, 'google', true]
      );

      user = result.rows[0];
    } else {
      user = user.rows[0];

      // Update Google ID if not set
      if (!user.google_id) {
        await db.query(
          'UPDATE users SET google_id = $1, avatar_url = $2 WHERE id = $3',
          [googleId, avatarUrl, user.id]
        );
        user.avatar_url = avatarUrl;
      }
    }

    if (!user.is_active) {
      return res.status(401).json({ error: 'Account is deactivated.' });
    }

    const token = generateToken(user.id);

    res.json({
      message: 'Google authentication successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        avatarUrl: user.avatar_url,
        isVerified: user.is_verified
      },
      token
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: 'Google authentication failed.' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        firstName: req.user.first_name,
        lastName: req.user.last_name,
        phone: req.user.phone,
        avatarUrl: req.user.avatar_url,
        isVerified: req.user.is_verified
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user data.' });
  }
});

// Logout
router.post('/logout', auth, async (req, res) => {
  try {
    await blacklistToken(req.token, req.user.id);
    res.json({ message: 'Logged out successfully.' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed.' });
  }
});

module.exports = router; 