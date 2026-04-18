// src/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows us to parse JSON payloads

// Health Check & DB Test Route
app.get('/api/health', async (req, res) => {
  try {
    // A simple query to verify Postgres is responding
    const result = await db.query('SELECT NOW() AS current_time');
    res.status(200).json({
      status: 'success',
      message: 'API is running',
      database_time: result.rows.current_time
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});

// Boot the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});