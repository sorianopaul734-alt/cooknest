const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // connect to DB
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    // find user by email
    const [rows] = await conn.execute('SELECT * FROM users WHERE email=?', [email]);
    const user = rows[0];

    if (!user) {
      await conn.end();
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      await conn.end();
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,   // must exist in .env
      { expiresIn: '1h' }
    );

    await conn.end();
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
