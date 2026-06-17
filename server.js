const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Test connection
db.connect(err => {
  if (err) throw err;
  console.log("MySQL Connected!");
});

// Routes
app.get('/students', (req, res) => {
  db.query("SELECT * FROM students", (err, result) => {
    if (err) return res.json({error: err});
    res.json(result);
  });
});

app.post('/students', (req, res) => {
  const { name, age } = req.body;
  db.query("INSERT INTO students (name, age) VALUES (?, ?)", [name, age], (err, result) => {
    if (err) return res.json({error: err});
    res.json({message: "Student added!"});
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
