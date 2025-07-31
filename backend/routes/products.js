const express = require('express');
const db = require('../config/database');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all products (public)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, subcategory, search, sort = 'created_at', order = 'DESC', limit = 20, page = 1 } = req.query;
    
    let whereClause = 'WHERE is_active = true';
    const values = [];
    let paramCount = 1;

    if (category) {
      whereClause += ` AND category = $${paramCount}`;
      values.push(category);
      paramCount++;
    }

    if (subcategory) {
      whereClause += ` AND subcategory = $${paramCount}`;
      values.push(subcategory);
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
       images, features, specifications, stock_quantity, created_at 
       FROM products ${whereClause} 
       ORDER BY ${sort} ${order} 
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      values
    );

    // Get total count for pagination
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

// Get single product by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'SELECT * FROM products WHERE id = $1 AND is_active = true',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.json({ product: result.rows[0] });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to get product.' });
  }
});

// Get product categories
router.get('/categories/list', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT DISTINCT category, subcategory FROM products WHERE is_active = true ORDER BY category, subcategory'
    );

    const categories = {};
    result.rows.forEach(row => {
      if (!categories[row.category]) {
        categories[row.category] = [];
      }
      if (row.subcategory && !categories[row.category].includes(row.subcategory)) {
        categories[row.category].push(row.subcategory);
      }
    });

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to get categories.' });
  }
});

// Search products
router.get('/search/:query', optionalAuth, async (req, res) => {
  try {
    const { query } = req.params;
    const { limit = 10 } = req.query;

    const result = await db.query(
      `SELECT id, name, description, price, original_price, currency, category, subcategory, 
       images, stock_quantity 
       FROM products 
       WHERE is_active = true AND (name ILIKE $1 OR description ILIKE $1 OR category ILIKE $1) 
       ORDER BY 
         CASE WHEN name ILIKE $1 THEN 1 
              WHEN name ILIKE $2 THEN 2 
              ELSE 3 END,
         created_at DESC 
       LIMIT $3`,
      [`%${query}%`, `${query}%`, limit]
    );

    res.json({ products: result.rows });
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({ error: 'Failed to search products.' });
  }
});

// Get featured products
router.get('/featured/list', optionalAuth, async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const result = await db.query(
      `SELECT id, name, description, price, original_price, currency, category, subcategory, 
       images, features, stock_quantity 
       FROM products 
       WHERE is_active = true 
       ORDER BY created_at DESC 
       LIMIT $1`,
      [limit]
    );

    res.json({ products: result.rows });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ error: 'Failed to get featured products.' });
  }
});

// Get products by category
router.get('/category/:category', optionalAuth, async (req, res) => {
  try {
    const { category } = req.params;
    const { subcategory, limit = 20, page = 1 } = req.query;

    let whereClause = 'WHERE is_active = true AND category = $1';
    const values = [category];
    let paramCount = 2;

    if (subcategory) {
      whereClause += ` AND subcategory = $${paramCount}`;
      values.push(subcategory);
      paramCount++;
    }

    const offset = (page - 1) * limit;
    values.push(limit, offset);

    const result = await db.query(
      `SELECT id, name, description, price, original_price, currency, category, subcategory, 
       images, features, stock_quantity, created_at 
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
    console.error('Get products by category error:', error);
    res.status(500).json({ error: 'Failed to get products by category.' });
  }
});

module.exports = router; 