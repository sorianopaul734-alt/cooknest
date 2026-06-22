const express = require('express');
const app = express();

// Root route
app.get('/', (req, res) => {
  res.send('CookNest backend is live 🚀');
});

// Health check route
app.get('/healthz', (req, res) => {
  res.sendStatus(200);
});

module.exports = app;
