const jwt = require('jsonwebtoken');
const db = require('../config/database');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if token is blacklisted
    const blacklistedToken = await db.query(
      'SELECT * FROM user_sessions WHERE token_hash = $1 AND expires_at > NOW()',
      [token]
    );

    if (blacklistedToken.rows.length > 0) {
      return res.status(401).json({ error: 'Token has been invalidated.' });
    }

    // Get user from database
    const userResult = await db.query(
      'SELECT id, email, first_name, last_name, avatar_url, is_verified, is_active FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'User not found.' });
    }

    const user = userResult.rows[0];

    if (!user.is_active) {
      return res.status(401).json({ error: 'Account is deactivated.' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired.' });
    }
    res.status(500).json({ error: 'Authentication error.' });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, async () => {
      const adminResult = await db.query(
        'SELECT * FROM admin_users WHERE user_id = $1',
        [req.user.id]
      );

      if (adminResult.rows.length === 0) {
        return res.status(403).json({ error: 'Admin access required.' });
      }

      req.admin = adminResult.rows[0];
      next();
    });
  } catch (error) {
    res.status(500).json({ error: 'Admin authentication error.' });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const userResult = await db.query(
      'SELECT id, email, first_name, last_name, avatar_url, is_verified, is_active FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userResult.rows.length > 0 && userResult.rows[0].is_active) {
      req.user = userResult.rows[0];
      req.token = token;
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

module.exports = { auth, adminAuth, optionalAuth }; 