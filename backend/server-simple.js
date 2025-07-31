const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// In-memory storage for testing (replace with database in production)
const users = [];
const otpCodes = [];

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_in_production';

// Helper functions
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Flexora Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Auth routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone: phone || null,
      avatarUrl: null,
      isVerified: true,
      authProvider: 'email',
      googleId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newUser);

    // Generate token
    const token = generateToken(newUser.id);

    // Return user data (without password)
    const { password: _, ...userData } = newUser;

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: userData
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user.id);

    // Return user data (without password)
    const { password: _, ...userData } = user;

    res.status(200).json({
      message: 'Login successful',
      token,
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP (in production, send via SMS)
    otpCodes.push({
      phone,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      isUsed: false
    });

    console.log(`OTP for ${phone}: ${otp}`); // For testing only

    res.status(200).json({
      message: 'OTP sent successfully',
      phone
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { phone, otp, firstName, lastName, email } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ error: 'Phone and OTP are required' });
    }

    // Find OTP
    const otpRecord = otpCodes.find(
      record => record.phone === phone && 
      record.otp === otp && 
      !record.isUsed && 
      record.expiresAt > new Date()
    );

    if (!otpRecord) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Mark OTP as used
    otpRecord.isUsed = true;

    // Check if user exists
    let user = users.find(u => u.phone === phone);

    if (!user && firstName && lastName) {
      // Create new user
      user = {
        id: Date.now().toString(),
        email: email || `${phone}@temp.com`,
        password: null,
        firstName,
        lastName,
        phone,
        avatarUrl: null,
        isVerified: true,
        authProvider: 'phone',
        googleId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      users.push(user);
    }

    if (!user) {
      return res.status(400).json({ error: 'User not found. Please provide first and last name for new users.' });
    }

    // Generate token
    const token = generateToken(user.id);

    // Return user data (without password)
    const { password: _, ...userData } = user;

    res.status(200).json({
      message: 'OTP verified successfully',
      token,
      user: userData
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/google', async (req, res) => {
  try {
    const { googleId, email, firstName, lastName, avatarUrl } = req.body;

    if (!googleId || !email || !firstName || !lastName) {
      return res.status(400).json({ error: 'Google data is incomplete' });
    }

    // Check if user exists
    let user = users.find(u => u.googleId === googleId || u.email === email);

    if (!user) {
      // Create new user
      user = {
        id: Date.now().toString(),
        email,
        password: null,
        firstName,
        lastName,
        phone: null,
        avatarUrl,
        isVerified: true,
        authProvider: 'google',
        googleId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      users.push(user);
    } else {
      // Update existing user
      user.googleId = googleId;
      user.firstName = firstName;
      user.lastName = lastName;
      user.avatarUrl = avatarUrl;
      user.authProvider = 'google';
      user.updatedAt = new Date().toISOString();
    }

    // Generate token
    const token = generateToken(user.id);

    // Return user data (without password)
    const { password: _, ...userData } = user;

    res.status(200).json({
      message: 'Google login successful',
      token,
      user: userData
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/auth/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Return user data (without password)
    const { password: _, ...userData } = user;

    res.status(200).json({
      user: userData
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.post('/api/auth/logout', async (req, res) => {
  try {
    // In a real app, you might want to blacklist the token
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User routes
app.get('/api/users/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Return user data with empty addresses array for now
    const { password: _, ...userData } = user;

    res.status(200).json({
      user: userData,
      addresses: [] // Empty for now
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.put('/api/users/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Update user data
    const { firstName, lastName, phone } = req.body;
    
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;
    user.updatedAt = new Date().toISOString();

    // Return updated user data (without password)
    const { password: _, ...userData } = user;

    res.status(200).json({
      message: 'Profile updated successfully',
      user: userData
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Flexora Backend Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

module.exports = app; 