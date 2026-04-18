// src/config/db.js
const { Pool } = require('pg');
require('dotenv').config();

// Initialize the Postgres connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test the connection immediately
pool.on('connect', () => {
  console.log('✅ Connected to the PostgreSQL Database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};