const express = require('express');
const { body, validationResult } = require('express-validator');
const Razorpay = require('razorpay');
const db = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create payment order
router.post('/create-order', auth, [
  body('orderId').isUUID(),
  body('amount').isNumeric(),
  body('currency').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { orderId, amount, currency = 'INR' } = req.body;

    // Verify order belongs to user
    const orderResult = await db.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [orderId, req.user.id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const order = orderResult.rows[0];

    if (order.status === 'cancelled') {
      return res.status(400).json({ error: 'Cannot process payment for cancelled order.' });
    }

    // Check if payment already exists
    const existingPayment = await db.query(
      'SELECT * FROM payments WHERE order_id = $1 AND payment_status = $2',
      [orderId, 'paid']
    );

    if (existingPayment.rows.length > 0) {
      return res.status(400).json({ error: 'Payment already completed for this order.' });
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: currency,
      receipt: order.order_number,
      notes: {
        order_id: orderId,
        user_id: req.user.id
      }
    });

    // Save payment record
    const paymentResult = await db.query(
      `INSERT INTO payments (
        order_id, amount, currency, payment_method, payment_status, 
        transaction_id, gateway_response
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        orderId,
        amount,
        currency,
        'razorpay',
        'pending',
        razorpayOrder.id,
        JSON.stringify(razorpayOrder)
      ]
    );

    res.json({
      message: 'Payment order created',
      payment: {
        id: paymentResult.rows[0].id,
        razorpayOrderId: razorpayOrder.id,
        amount: amount,
        currency: currency,
        key: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    console.error('Create payment order error:', error);
    res.status(500).json({ error: 'Failed to create payment order.' });
  }
});

// Verify payment
router.post('/verify', auth, [
  body('orderId').isUUID(),
  body('paymentId').isString(),
  body('signature').isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { orderId, paymentId, signature } = req.body;

    // Verify order belongs to user
    const orderResult = await db.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [orderId, req.user.id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const order = orderResult.rows[0];

    // Verify signature
    const text = `${orderId}|${paymentId}`;
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).json({ error: 'Invalid payment signature.' });
    }

    // Verify payment with Razorpay
    const payment = await razorpay.payments.fetch(paymentId);

    if (payment.status !== 'captured') {
      return res.status(400).json({ error: 'Payment not captured.' });
    }

    // Start transaction
    await db.query('BEGIN');

    try {
      // Update payment record
      await db.query(
        `UPDATE payments SET 
         payment_status = $1, 
         transaction_id = $2, 
         gateway_response = $3,
         updated_at = NOW() 
         WHERE order_id = $4 AND payment_status = $5`,
        [
          'paid',
          paymentId,
          JSON.stringify(payment),
          orderId,
          'pending'
        ]
      );

      // Update order status
      await db.query(
        'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2',
        ['processing', orderId]
      );

      // Add tracking entry
      await db.query(
        'INSERT INTO order_tracking (order_id, status, description) VALUES ($1, $2, $3)',
        [orderId, 'processing', 'Payment received, order processing started']
      );

      await db.query('COMMIT');

      res.json({
        message: 'Payment verified successfully',
        payment: {
          id: paymentId,
          status: 'paid',
          amount: payment.amount / 100,
          currency: payment.currency
        }
      });
    } catch (error) {
      await db.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ error: 'Failed to verify payment.' });
  }
});

// Get payment status
router.get('/status/:orderId', auth, async (req, res) => {
  try {
    const { orderId } = req.params;

    // Verify order belongs to user
    const orderResult = await db.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [orderId, req.user.id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    // Get payment info
    const paymentResult = await db.query(
      'SELECT * FROM payments WHERE order_id = $1 ORDER BY created_at DESC LIMIT 1',
      [orderId]
    );

    res.json({
      order: {
        id: orderResult.rows[0].id,
        orderNumber: orderResult.rows[0].order_number,
        status: orderResult.rows[0].status,
        totalAmount: orderResult.rows[0].total_amount
      },
      payment: paymentResult.rows[0] || null
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ error: 'Failed to get payment status.' });
  }
});

// Refund payment (admin only)
router.post('/refund/:paymentId', auth, async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { amount, reason } = req.body;

    // Check if user is admin
    const adminResult = await db.query(
      'SELECT * FROM admin_users WHERE user_id = $1',
      [req.user.id]
    );

    if (adminResult.rows.length === 0) {
      return res.status(403).json({ error: 'Admin access required.' });
    }

    // Get payment details
    const paymentResult = await db.query(
      'SELECT * FROM payments WHERE transaction_id = $1 AND payment_status = $2',
      [paymentId, 'paid']
    );

    if (paymentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Payment not found or not eligible for refund.' });
    }

    const payment = paymentResult.rows[0];

    // Process refund through Razorpay
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount ? Math.round(amount * 100) : undefined,
      notes: {
        reason: reason || 'Customer request'
      }
    });

    // Update payment status
    await db.query(
      'UPDATE payments SET payment_status = $1, gateway_response = $2, updated_at = NOW() WHERE id = $3',
      ['refunded', JSON.stringify(refund), payment.id]
    );

    // Update order status if full refund
    if (!amount || amount >= payment.amount) {
      await db.query(
        'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2',
        ['cancelled', payment.order_id]
      );

      // Add tracking entry
      await db.query(
        'INSERT INTO order_tracking (order_id, status, description) VALUES ($1, $2, $3)',
        [payment.order_id, 'cancelled', 'Order cancelled due to refund']
      );
    }

    res.json({
      message: 'Refund processed successfully',
      refund: {
        id: refund.id,
        amount: refund.amount / 100,
        status: refund.status
      }
    });
  } catch (error) {
    console.error('Refund payment error:', error);
    res.status(500).json({ error: 'Failed to process refund.' });
  }
});

// Get payment history for user
router.get('/history', auth, async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const offset = (page - 1) * limit;

    const result = await db.query(
      `SELECT p.*, o.order_number, o.status as order_status
       FROM payments p
       JOIN orders o ON p.order_id = o.id
       WHERE o.user_id = $1
       ORDER BY p.created_at DESC
       LIMIT $2 OFFSET $3`,
      [req.user.id, limit, offset]
    );

    // Get total count
    const countResult = await db.query(
      `SELECT COUNT(*) FROM payments p
       JOIN orders o ON p.order_id = o.id
       WHERE o.user_id = $1`,
      [req.user.id]
    );

    const totalCount = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      payments: result.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ error: 'Failed to get payment history.' });
  }
});

module.exports = router; 