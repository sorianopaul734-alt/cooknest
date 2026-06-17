const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection using Railway environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,       // mapped to ${MYSQLHOST} in Railway
  user: process.env.DB_USER,       // mapped to ${MYSQLUSER}
  password: process.env.DB_PASSWORD, // mapped to ${MYSQLPASSWORD}
  database: process.env.DB_NAME,   // mapped to ${MYSQLDATABASE}
  port: process.env.DB_PORT        // mapped to ${MYSQLPORT}
});

// Test connection
db.connect(err => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("MySQL Connected!");
});

// Routes
app.get('/students', (req, res) => {
  db.query("SELECT * FROM students", (err, result) => {
    if (err) return res.json({ error: err });
    res.json(result);
  });
});

app.post('/students', (req, res) => {
  const { name, age } = req.body;
  db.query("INSERT INTO students (name, age) VALUES (?, ?)", [name, age], (err, result) => {
    if (err) return res.json({ error: err });
    res.json({ message: "Student added!" });
  });
});

// Server listen with fallback
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
