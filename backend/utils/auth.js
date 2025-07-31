const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

// Password hashing
const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Password verification
const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Save OTP to database
const saveOTP = async (phone, otp) => {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  await db.query(
    'INSERT INTO otp_codes (phone, otp_code, expires_at) VALUES ($1, $2, $3)',
    [phone, otp, expiresAt]
  );
};

// Verify OTP
const verifyOTP = async (phone, otp) => {
  const result = await db.query(
    'SELECT * FROM otp_codes WHERE phone = $1 AND otp_code = $2 AND expires_at > NOW() AND is_used = false ORDER BY created_at DESC LIMIT 1',
    [phone, otp]
  );

  if (result.rows.length === 0) {
    return false;
  }

  // Mark OTP as used
  await db.query(
    'UPDATE otp_codes SET is_used = true WHERE id = $1',
    [result.rows[0].id]
  );

  return true;
};

// Blacklist token (for logout)
const blacklistToken = async (token, userId) => {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  
  await db.query(
    'INSERT INTO user_sessions (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
    [userId, token, expiresAt]
  );
};

// Generate order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `FLEX-${timestamp}-${random}`;
};

// Generate tracking number
const generateTrackingNumber = () => {
  return `TRK-${uuidv4().slice(0, 8).toUpperCase()}`;
};

module.exports = {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
  generateOTP,
  saveOTP,
  verifyOTP,
  blacklistToken,
  generateOrderNumber,
  generateTrackingNumber
}; 