const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get dashboard stats
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    // Get total users
    const usersResult = await db.query('SELECT COUNT(*) FROM users');
    const totalUsers = parseInt(usersResult.rows[0].count);

    // Get total orders
    const ordersResult = await db.query('SELECT COUNT(*) FROM orders');
    const totalOrders = parseInt(ordersResult.rows[0].count);

    // Get total revenue
    const revenueResult = await db.query(
      'SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status != $1',
      ['cancelled']
    );
    const totalRevenue = parseFloat(revenueResult.rows[0].sum);

    // Get recent orders
    const recentOrdersResult = await db.query(
      `SELECT o.id, o.order_number, o.status, o.total_amount, o.created_at,
              u.first_name, u.last_name, u.email
       FROM orders o
       JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC
       LIMIT 10`
    );

    // Get order status distribution
    const statusResult = await db.query(
      'SELECT status, COUNT(*) FROM orders GROUP BY status'
    );

    const statusDistribution = {};
    statusResult.rows.forEach(row => {
      statusDistribution[row.status] = parseInt(row.count);
    });

    res.json({
      stats: {
        totalUsers,
        totalOrders,
        totalRevenue
      },
      recentOrders: recentOrdersResult.rows,
      statusDistribution
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to get dashboard stats.' });
  }
});

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { search, status, limit = 20, page = 1 } = req.query;
    
    let whereClause = 'WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (search) {
      whereClause += ` AND (email ILIKE $${paramCount} OR first_name ILIKE $${paramCount} OR last_name ILIKE $${paramCount})`;
      values.push(`%${search}%`);
      paramCount++;
    }

    if (status) {
      whereClause += ` AND is_active = $${paramCount}`;
      values.push(status === 'active');
      paramCount++;
    }

    const offset = (page - 1) * limit;
    values.push(limit, offset);

    const result = await db.query(
      `SELECT id, email, first_name, last_name, phone, avatar_url, is_verified, is_active, 
              auth_provider, created_at, updated_at
       FROM users ${whereClause} 
       ORDER BY created_at DESC 
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      values
    );

    // Get total count
    const countResult = await db.query(
      `SELECT COUNT(*) FROM users ${whereClause}`,
      values.slice(0, -2)
    );

    const totalCount = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      users: result.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users.' });
  }
});

// Update user status
router.put('/users/:id/status', adminAuth, [
  body('isActive').isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { isActive } = req.body;

    const result = await db.query(
      'UPDATE users SET is_active = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [isActive, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({
      message: 'User status updated successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ error: 'Failed to update user status.' });
  }
});

// Get all orders
router.get('/orders', adminAuth, async (req, res) => {
  try {
    const { status, search, limit = 20, page = 1 } = req.query;
    
    let whereClause = 'WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (status) {
      whereClause += ` AND o.status = $${paramCount}`;
      values.push(status);
      paramCount++;
    }

    if (search) {
      whereClause += ` AND (o.order_number ILIKE $${paramCount} OR u.email ILIKE $${paramCount})`;
      values.push(`%${search}%`);
      paramCount++;
    }

    const offset = (page - 1) * limit;
    values.push(limit, offset);

    const result = await db.query(
      `SELECT o.id, o.order_number, o.status, o.total_amount, o.currency, 
              o.created_at, o.updated_at,
              u.first_name, u.last_name, u.email,
              (SELECT payment_status FROM payments WHERE order_id = o.id ORDER BY created_at DESC LIMIT 1) as payment_status
       FROM orders o
       JOIN users u ON o.user_id = u.id
       ${whereClause} 
       ORDER BY o.created_at DESC 
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      values
    );

    // Get total count
    const countResult = await db.query(
      `SELECT COUNT(*) FROM orders o
       JOIN users u ON o.user_id = u.id
       ${whereClause}`,
      values.slice(0, -2)
    );

    const totalCount = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      orders: result.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to get orders.' });
  }
});

// Update order status
router.put('/orders/:id/status', adminAuth, [
  body('status').isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  body('description').optional().isString(),
  body('location').optional().isString(),
  body('trackingNumber').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status, description, location, trackingNumber } = req.body;

    // Start transaction
    await db.query('BEGIN');

    try {
      // Update order status
      await db.query(
        'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2',
        [status, id]
      );

      // Add tracking entry
      await db.query(
        'INSERT INTO order_tracking (order_id, status, description, location, tracking_number, updated_by) VALUES ($1, $2, $3, $4, $5, $6)',
        [id, status, description || `Order status updated to ${status}`, location, trackingNumber, req.user.id]
      );

      await db.query('COMMIT');

      res.json({ message: 'Order status updated successfully' });
    } catch (error) {
      await db.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status.' });
  }
});

// Get order details
router.get('/orders/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Get order
    const orderResult = await db.query(
      `SELECT o.*, u.first_name, u.last_name, u.email, u.phone
       FROM orders o
       JOIN users u ON o.user_id = u.id
       WHERE o.id = $1`,
      [id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const order = orderResult.rows[0];

    // Get order items
    const itemsResult = await db.query(
      'SELECT * FROM order_items WHERE order_id = $1',
      [id]
    );

    // Get order tracking
    const trackingResult = await db.query(
      'SELECT * FROM order_tracking WHERE order_id = $1 ORDER BY created_at DESC',
      [id]
    );

    // Get payment info
    const paymentResult = await db.query(
      'SELECT * FROM payments WHERE order_id = $1 ORDER BY created_at DESC LIMIT 1',
      [id]
    );

    res.json({
      order: {
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        totalAmount: order.total_amount,
        currency: order.currency,
        shippingAddress: order.shipping_address,
        billingAddress: order.billing_address,
        notes: order.notes,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        customer: {
          name: `${order.first_name} ${order.last_name}`,
          email: order.email,
          phone: order.phone
        }
      },
      items: itemsResult.rows,
      tracking: trackingResult.rows,
      payment: paymentResult.rows[0] || null
    });
  } catch (error) {
    console.error('Get order details error:', error);
    res.status(500).json({ error: 'Failed to get order details.' });
  }
});

// Get all products
router.get('/products', adminAuth, async (req, res) => {
  try {
    const { category, search, limit = 20, page = 1 } = req.query;
    
    let whereClause = 'WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (category) {
      whereClause += ` AND category = $${paramCount}`;
      values.push(category);
      paramCount++;
    }

    if (search) {
      whereClause += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      values.push(`%${search}%`);
      paramCount++;
    }

    const offset = (page - 1) * limit;
    values.push(limit, offset);

    const result = await db.query(
      `SELECT id, name, description, price, original_price, currency, category, subcategory,
              images, features, specifications, stock_quantity, is_active, created_at, updated_at
       FROM products ${whereClause} 
       ORDER BY created_at DESC 
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      values
    );

    // Get total count
    const countResult = await db.query(
      `SELECT COUNT(*) FROM products ${whereClause}`,
      values.slice(0, -2)
    );

    const totalCount = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      products: result.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to get products.' });
  }
});

// Create product
router.post('/products', adminAuth, [
  body('name').trim().notEmpty(),
  body('description').optional().isString(),
  body('price').isNumeric(),
  body('originalPrice').optional().isNumeric(),
  body('category').optional().isString(),
  body('subcategory').optional().isString(),
  body('stockQuantity').optional().isInt({ min: 0 }),
  body('images').optional().isArray(),
  body('features').optional().isObject(),
  body('specifications').optional().isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      description,
      price,
      originalPrice,
      category,
      subcategory,
      stockQuantity = 0,
      images = [],
      features = {},
      specifications = {}
    } = req.body;

    const result = await db.query(
      `INSERT INTO products (
        name, description, price, original_price, category, subcategory,
        stock_quantity, images, features, specifications
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [name, description, price, originalPrice, category, subcategory, stockQuantity, images, features, specifications]
    );

    res.status(201).json({
      message: 'Product created successfully',
      product: result.rows[0]
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product.' });
  }
});

// Update product
router.put('/products/:id', adminAuth, [
  body('name').optional().trim().notEmpty(),
  body('description').optional().isString(),
  body('price').optional().isNumeric(),
  body('originalPrice').optional().isNumeric(),
  body('category').optional().isString(),
  body('subcategory').optional().isString(),
  body('stockQuantity').optional().isInt({ min: 0 }),
  body('isActive').optional().isBoolean(),
  body('images').optional().isArray(),
  body('features').optional().isObject(),
  body('specifications').optional().isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updates = req.body;

    const updateFields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        updateFields.push(`${key.replace(/([A-Z])/g, '_$1').toLowerCase()} = $${paramCount}`);
        values.push(updates[key]);
        paramCount++;
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update.' });
    }

    values.push(id);

    const result = await db.query(
      `UPDATE products SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.json({
      message: 'Product updated successfully',
      product: result.rows[0]
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product.' });
  }
});

// Delete product
router.delete('/products/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product.' });
  }
});

module.exports = router; 