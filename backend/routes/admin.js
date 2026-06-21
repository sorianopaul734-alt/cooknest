// routes/admin.js
const express = require('express');
const mysql = require('mysql2/promise');
const router = express.Router();

// PUT /users/:id/role
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body; // expected: 'admin' or 'user'
    const userId = req.params.id;

    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    await conn.execute(
      'UPDATE users SET role = ? WHERE id = ?',
      [role, userId]
    );

    await conn.end();
    res.json({ message: `User ${userId} role updated to ${role}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update role' });
  }
});

module.exports = router;
