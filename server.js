const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET; // set this in Railway env vars

// ===================== DB POOL =====================
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10
});

db.getConnection()
  .then(conn => { console.log('MySQL Connected!'); conn.release(); })
  .catch(err => console.error('Database connection failed:', err));

// ===================== AUTH MIDDLEWARE =====================
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access only' });
  }
  next();
}

/* ===================== USERS / AUTH ===================== */
app.post('/users/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'An account with that email already exists' });
    }

    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hash, 'customer']
    );

    const user = { id: result.insertId, name, email, role: 'customer' };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const dbUser = rows[0];
    const match = await bcrypt.compare(password, dbUser.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const user = { id: dbUser.id, name: dbUser.name, email: dbUser.email, role: dbUser.role };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Used by the frontend on page load to validate a stored token / get fresh user info
app.get('/users/me', requireAuth, async (req, res) => {
  res.json({ user: req.user });
});

// Admin-only: list all users
app.get('/users', requireAuth, requireAdmin, async (req, res) => {
  const [rows] = await db.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
  res.json(rows);
});

/* ===================== RECIPES ===================== */
// Public: anyone can browse recipes
app.get('/recipes', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM recipes ORDER BY id ASC');
    const parsed = rows.map(r => ({
      ...r,
      ing: typeof r.ing === 'string' ? JSON.parse(r.ing) : r.ing,
      steps: typeof r.steps === 'string' ? JSON.parse(r.steps) : r.steps
    }));
    res.json(parsed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// Admin-only: create
app.post('/recipes', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { title, cat, emoji, description, ing, steps, price, rating, reviews, added } = req.body;
    const [result] = await db.query(
      `INSERT INTO recipes (title, cat, emoji, description, ing, steps, price, rating, reviews, added)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, cat, emoji, description, JSON.stringify(ing || []), JSON.stringify(steps || []),
       price || 0, rating || 5.0, reviews || 0, added || new Date().toISOString().slice(0, 10)]
    );
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create recipe' });
  }
});

// Admin-only: update
app.put('/recipes/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { title, cat, emoji, description, ing, steps, price, rating, reviews } = req.body;
    await db.query(
      `UPDATE recipes SET title=?, cat=?, emoji=?, description=?, ing=?, steps=?, price=?, rating=?, reviews=?
       WHERE id=?`,
      [title, cat, emoji, description, JSON.stringify(ing || []), JSON.stringify(steps || []),
       price || 0, rating || 5.0, reviews || 0, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update recipe' });
  }
});

// Admin-only: delete
app.delete('/recipes/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM recipes WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
});

/* ===================== ORDERS ===================== */
// Customer: place an order (their own)
app.post('/orders', requireAuth, async (req, res) => {
  try {
    const { items, total, payment_method } = req.body; // items: [{recipe_id, qty, price_each}]
    const [result] = await db.query(
      'INSERT INTO orders (user_id, total, status, payment_method) VALUES (?, ?, ?, ?)',
      [req.user.id, total, 'Confirmed', payment_method || 'GCash']
    );
    const orderId = result.insertId;

    if (Array.isArray(items) && items.length) {
      const values = items.map(i => [orderId, i.recipe_id, i.qty, i.price_each]);
      await db.query('INSERT INTO order_items (order_id, recipe_id, qty, price_each) VALUES ?', [values]);
    }

    res.json({ success: true, id: orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// Customer: their own orders. Admin: anyone's orders (or all, via /orders/all)
app.get('/orders/all', requireAuth, requireAdmin, async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*, u.name AS customer_name, u.email AS customer_email
       FROM orders o JOIN users u ON u.id = o.user_id
       ORDER BY o.date DESC`
    );
    if (orders.length === 0) return res.json([]);

    const orderIds = orders.map(o => o.id);
    const [items] = await db.query(
      `SELECT oi.order_id, oi.qty, oi.price_each, r.title, r.emoji
       FROM order_items oi JOIN recipes r ON r.id = oi.recipe_id
       WHERE oi.order_id IN (?)`,
      [orderIds]
    );
    const itemsByOrder = {};
    for (const it of items) {
      (itemsByOrder[it.order_id] ||= []).push(it);
    }
    const result = orders.map(o => ({ ...o, items: itemsByOrder[o.id] || [] }));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.get('/orders/:user_id', requireAuth, async (req, res) => {
  const requestedId = Number(req.params.user_id);
  if (req.user.id !== requestedId && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not allowed' });
  }
  const [rows] = await db.query('SELECT * FROM orders WHERE user_id = ? ORDER BY date DESC', [requestedId]);
  res.json(rows);
});

// Admin-only: update order status
app.put('/orders/:id/status', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

/* ===================== CART ===================== */
app.post('/cart', requireAuth, async (req, res) => {
  try {
    const { recipe_id, qty } = req.body;
    await db.query(
      `INSERT INTO cart (user_id, recipe_id, qty) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE qty = qty + VALUES(qty)`,
      [req.user.id, recipe_id, qty || 1]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

app.get('/cart/:user_id', requireAuth, async (req, res) => {
  const requestedId = Number(req.params.user_id);
  if (req.user.id !== requestedId) return res.status(403).json({ error: 'Not allowed' });
  const [rows] = await db.query(
    `SELECT c.*, r.title, r.price, r.emoji FROM cart c
     JOIN recipes r ON r.id = c.recipe_id WHERE c.user_id = ?`,
    [requestedId]
  );
  res.json(rows);
});

app.delete('/cart/:id', requireAuth, async (req, res) => {
  await db.query('DELETE FROM cart WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
  res.json({ success: true });
});

/* ===================== COMMENTS ===================== */
app.post('/comments', requireAuth, async (req, res) => {
  try {
    const { recipe_id, text, rating } = req.body;
    const [result] = await db.query(
      'INSERT INTO comments (recipe_id, user_id, text, rating) VALUES (?, ?, ?, ?)',
      [recipe_id, req.user.id, text, rating || 5]
    );
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to post comment' });
  }
});

app.get('/comments/:recipe_id', async (req, res) => {
  const [rows] = await db.query(
    `SELECT c.*, u.name FROM comments c JOIN users u ON u.id = c.user_id
     WHERE c.recipe_id = ? ORDER BY c.created_at DESC`,
    [req.params.recipe_id]
  );
  res.json(rows);
});

// Admin-only: get every comment across all recipes, for moderation
app.get('/comments', requireAuth, requireAdmin, async (req, res) => {
  const [rows] = await db.query(
    `SELECT c.*, u.name, r.title AS recipe_title FROM comments c
     JOIN users u ON u.id = c.user_id JOIN recipes r ON r.id = c.recipe_id
     ORDER BY c.created_at DESC`
  );
  res.json(rows);
});

// Admin-only: delete a comment (moderation)
app.delete('/comments/:id', requireAuth, requireAdmin, async (req, res) => {
  await db.query('DELETE FROM comments WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

/* ===================== SETTINGS (fan favourite) ===================== */
app.get('/settings/fan-fav', async (req, res) => {
  const [rows] = await db.query("SELECT `value` FROM settings WHERE `key` = 'fan_fav_id'");
  res.json({ fan_fav_id: rows.length ? Number(rows[0].value) : null });
});

app.put('/settings/fan-fav', requireAuth, requireAdmin, async (req, res) => {
  const { recipe_id } = req.body;
  await db.query(
    "INSERT INTO settings (`key`, `value`) VALUES ('fan_fav_id', ?) ON DUPLICATE KEY UPDATE `value` = ?",
    [String(recipe_id), String(recipe_id)]
  );
  res.json({ success: true });
});

/* ===================== SERVER ===================== */
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});

// mount signup route
app.use(require('./signup'));



// mount admin routes
const adminRoutes = require('./routes/admin');
app.use('/api', adminRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
