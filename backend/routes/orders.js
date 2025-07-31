const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { auth, optionalAuth } = require('../middleware/auth');
const { generateOrderNumber, generateTrackingNumber } = require('../utils/auth');

const router = express.Router();

// Create new order
router.post('/', auth, [
  body('items').isArray({ min: 1 }),
  body('items.*.productId').isUUID(),
  body('items.*.quantity').isInt({ min: 1 }),
  body('shippingAddress').isObject(),
  body('billingAddress').optional().isObject(),
  body('notes').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items, shippingAddress, billingAddress, notes } = req.body;

    // Start transaction
    await db.query('BEGIN');

    try {
      // Generate order number
      const orderNumber = generateOrderNumber();

      // Calculate total amount and validate products
      let totalAmount = 0;
      const orderItems = [];

      for (const item of items) {
        const productResult = await db.query(
          'SELECT id, name, price, stock_quantity FROM products WHERE id = $1 AND is_active = true',
          [item.productId]
        );

        if (productResult.rows.length === 0) {
          throw new Error(`Product ${item.productId} not found`);
        }

        const product = productResult.rows[0];

        if (product.stock_quantity < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;

        orderItems.push({
          productId: product.id,
          productName: product.name,
          productPrice: product.price,
          quantity: item.quantity,
          totalPrice: itemTotal
        });

        // Update stock
        await db.query(
          'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2',
          [item.quantity, product.id]
        );
      }

      // Create order
      const orderResult = await db.query(
        `INSERT INTO orders (
          order_number, user_id, total_amount, currency, shipping_address, 
          billing_address, notes, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [
          orderNumber,
          req.user.id,
          totalAmount,
          'INR',
          JSON.stringify(shippingAddress),
          JSON.stringify(billingAddress || shippingAddress),
          notes,
          'pending'
        ]
      );

      const order = orderResult.rows[0];

      // Create order items
      for (const item of orderItems) {
        await db.query(
          `INSERT INTO order_items (
            order_id, product_id, product_name, product_price, quantity, total_price
          ) VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            order.id,
            item.productId,
            item.productName,
            item.productPrice,
            item.quantity,
            item.totalPrice
          ]
        );
      }

      // Create initial tracking entry
      const trackingNumber = generateTrackingNumber();
      await db.query(
        'INSERT INTO order_tracking (order_id, status, description, tracking_number) VALUES ($1, $2, $3, $4)',
        [order.id, 'pending', 'Order placed successfully', trackingNumber]
      );

      await db.query('COMMIT');

      res.status(201).json({
        message: 'Order created successfully',
        order: {
          id: order.id,
          orderNumber: order.order_number,
          totalAmount: order.total_amount,
          status: order.status,
          trackingNumber,
          createdAt: order.created_at
        }
      });
    } catch (error) {
      await db.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: error.message || 'Failed to create order.' });
  }
});

// Get user orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const { status, limit = 10, page = 1 } = req.query;
    
    let whereClause = 'WHERE o.user_id = $1';
    const values = [req.user.id];
    let paramCount = 2;

    if (status) {
      whereClause += ` AND o.status = $${paramCount}`;
      values.push(status);
      paramCount++;
    }

    const offset = (page - 1) * limit;
    values.push(limit, offset);

    const result = await db.query(
      `SELECT o.id, o.order_number, o.status, o.total_amount, o.currency, 
              o.created_at, o.updated_at,
              (SELECT status FROM order_tracking WHERE order_id = o.id ORDER BY created_at DESC LIMIT 1) as latest_status,
              (SELECT tracking_number FROM order_tracking WHERE order_id = o.id ORDER BY created_at DESC LIMIT 1) as tracking_number
       FROM orders o ${whereClause} 
       ORDER BY o.created_at DESC 
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      values
    );

    // Get total count
    const countResult = await db.query(
      `SELECT COUNT(*) FROM orders o ${whereClause}`,
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
    console.error('Get user orders error:', error);
    res.status(500).json({ error: 'Failed to get orders.' });
  }
});

// Get single order details
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Get order
    const orderResult = await db.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
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
        updatedAt: order.updated_at
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

// Cancel order
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if order belongs to user and can be cancelled
    const orderResult = await db.query(
      'SELECT status FROM orders WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const order = orderResult.rows[0];

    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Order cannot be cancelled at this stage.' });
    }

    // Start transaction
    await db.query('BEGIN');

    try {
      // Update order status
      await db.query(
        'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2',
        ['cancelled', id]
      );

      // Restore product stock
      const itemsResult = await db.query(
        'SELECT product_id, quantity FROM order_items WHERE order_id = $1',
        [id]
      );

      for (const item of itemsResult.rows) {
        await db.query(
          'UPDATE products SET stock_quantity = stock_quantity + $1 WHERE id = $2',
          [item.quantity, item.product_id]
        );
      }

      // Add tracking entry
      await db.query(
        'INSERT INTO order_tracking (order_id, status, description) VALUES ($1, $2, $3)',
        [id, 'cancelled', 'Order cancelled by customer']
      );

      await db.query('COMMIT');

      res.json({ message: 'Order cancelled successfully' });
    } catch (error) {
      await db.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ error: 'Failed to cancel order.' });
  }
});

// Track order by order number (public)
router.get('/track/:orderNumber', optionalAuth, async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { email } = req.query;

    let whereClause = 'WHERE o.order_number = $1';
    const values = [orderNumber];
    let paramCount = 2;

    if (email) {
      whereClause += ` AND u.email = $${paramCount}`;
      values.push(email);
      paramCount++;
    } else if (!req.user) {
      return res.status(400).json({ error: 'Email is required for guest tracking.' });
    }

    const orderResult = await db.query(
      `SELECT o.id, o.order_number, o.status, o.total_amount, o.currency, o.created_at,
              u.first_name, u.last_name, u.email
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       ${whereClause}`,
      values
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const order = orderResult.rows[0];

    // Get tracking info
    const trackingResult = await db.query(
      'SELECT * FROM order_tracking WHERE order_id = $1 ORDER BY created_at DESC',
      [order.id]
    );

    res.json({
      order: {
        orderNumber: order.order_number,
        status: order.status,
        totalAmount: order.total_amount,
        currency: order.currency,
        customerName: `${order.first_name} ${order.last_name}`,
        customerEmail: order.email,
        createdAt: order.created_at
      },
      tracking: trackingResult.rows
    });
  } catch (error) {
    console.error('Track order error:', error);
    res.status(500).json({ error: 'Failed to track order.' });
  }
});

module.exports = router; 