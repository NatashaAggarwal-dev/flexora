const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001;

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5178', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Flexora Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Test auth endpoint
app.post('/api/auth/signup', (req, res) => {
  console.log('Signup request received:', req.body);
  res.status(200).json({
    message: 'Test signup successful',
    token: 'test_token_123',
    user: {
      id: '1',
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      isVerified: true
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  console.log('Login request received:', req.body);
  res.status(200).json({
    message: 'Test login successful',
    token: 'test_token_123',
    user: {
      id: '1',
      email: req.body.email,
      firstName: 'Test',
      lastName: 'User',
      isVerified: true
    }
  });
});

app.post('/api/auth/send-otp', (req, res) => {
  console.log('Send OTP request received:', req.body);
  res.status(200).json({
    message: 'OTP sent successfully',
    phone: req.body.phone
  });
});

app.post('/api/auth/verify-otp', (req, res) => {
  console.log('Verify OTP request received:', req.body);
  res.status(200).json({
    message: 'OTP verified successfully',
    token: 'test_token_123',
    user: {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      isVerified: true
    }
  });
});

app.post('/api/auth/google', (req, res) => {
  console.log('Google login request received:', req.body);
  res.status(200).json({
    message: 'Google login successful',
    token: 'test_token_123',
    user: {
      id: '1',
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      isVerified: true
    }
  });
});

app.get('/api/auth/me', (req, res) => {
  console.log('Get profile request received');
  res.status(200).json({
    user: {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      isVerified: true
    }
  });
});

app.post('/api/auth/logout', (req, res) => {
  console.log('Logout request received');
  res.status(200).json({ message: 'Logout successful' });
});

app.get('/api/users/profile', (req, res) => {
  console.log('Get user profile request received');
  res.status(200).json({
    user: {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      isVerified: true
    },
    addresses: []
  });
});

app.put('/api/users/profile', (req, res) => {
  console.log('Update profile request received:', req.body);
  res.status(200).json({
    message: 'Profile updated successfully',
    user: {
      id: '1',
      email: 'test@example.com',
      firstName: req.body.firstName || 'Test',
      lastName: req.body.lastName || 'User',
      isVerified: true
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Test Backend Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log(`🌐 CORS enabled for: http://localhost:5173, 5178, 3000`);
});

module.exports = app; 