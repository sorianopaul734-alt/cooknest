const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection using Railway environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,       // ${MYSQLHOST}
  user: process.env.DB_USER,       // ${MYSQLUSER}
  password: process.env.DB_PASSWORD, // ${MYSQLPASSWORD}
  database: process.env.DB_NAME,   // ${MYSQLDATABASE}
  port: process.env.DB_PORT        // ${MYSQLPORT}
});

// Test connection
db.connect(err => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("MySQL Connected!");
});

/* ===================== RECIPES ===================== */
app.get('/recipes', (req, res) => {
  db.query("SELECT * FROM recipes", (err, result) => {
    if (err) return res.json({ error: err });
    res.json(result);
  });
});

app.post('/recipes', (req, res) => {
  const { title, cat, emoji, description, price, rating, reviews, added } = req.body;
  db.query(
    "INSERT INTO recipes (title, cat, emoji, description, price, rating, reviews, added) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [title, cat, emoji, description, price, rating, reviews, added],
    (err, result) => {
      if (err) return res.json({ error: err });
      res.json({ success: true, id: result.insertId });
    }
  );
});

/* ===================== USERS ===================== */
app.post('/users/register', (req, res) => {
  const { name, email, password } = req.body;
  db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, password],
    (err, result) => {
      if (err) return res.json({ error: err });
      res.json({ success: true, id: result.insertId });
    }
  );
});

app.post('/users/login', (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM users WHERE email=? AND password=?",
    [email, password],
    (err, result) => {
      if (err) return res.json({ error: err });
      if (result.length > 0) res.json({ success: true, user: result[0] });
      else res.json({ success: false, message: "Invalid credentials" });
    }
  );
});

/* ===================== ORDERS ===================== */
app.post('/orders', (req, res) => {
  const { user_id, total, status, date } = req.body;
  db.query("INSERT INTO orders (user_id, total, status, date) VALUES (?, ?, ?, ?)",
    [user_id, total, status, date],
    (err, result) => {
      if (err) return res.json({ error: err });
      res.json({ success: true, id: result.insertId });
    }
  );
});

app.get('/orders/:user_id', (req, res) => {
  db.query("SELECT * FROM orders WHERE user_id=?", [req.params.user_id],
    (err, result) => {
      if (err) return res.json({ error: err });
      res.json(result);
    }
  );
});

/* ===================== CART ===================== */
app.post('/cart', (req, res) => {
  const { user_id, recipe_id, qty } = req.body;
  db.query("INSERT INTO cart (user_id, recipe_id, qty) VALUES (?, ?, ?)",
    [user_id, recipe_id, qty],
    (err, result) => {
      if (err) return res.json({ error: err });
      res.json({ success: true, id: result.insertId });
    }
  );
});

app.get('/cart/:user_id', (req, res) => {
  db.query("SELECT * FROM cart WHERE user_id=?", [req.params.user_id],
    (err, result) => {
      if (err) return res.json({ error: err });
      res.json(result);
    }
  );
});

/* ===================== COMMENTS ===================== */
app.post('/comments', (req, res) => {
  const { recipe_id, user_id, text, rating } = req.body;
  db.query("INSERT INTO comments (recipe_id, user_id, text, rating) VALUES (?, ?, ?, ?)",
    [recipe_id, user_id, text, rating],
    (err, result) => {
      if (err) return res.json({ error: err });
      res.json({ success: true, id: result.insertId });
    }
  );
});

app.get('/comments/:recipe_id', (req, res) => {
  db.query("SELECT * FROM comments WHERE recipe_id=?", [req.params.recipe_id],
    (err, result) => {
      if (err) return res.json({ error: err });
      res.json(result);
    }
  );
});

/* ===================== SERVER ===================== */
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});

// Example backend seeding
const defaultAdmin = {
  email: 'admin@cooknest.com',
  password: 'admin123', // Note: In production, this should be hashed!
  isAdmin: true
};