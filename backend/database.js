// src/db.js
const { Pool } = require('pg');
require('dotenv').config(); // Load environment variables

const pool = new Pool({
  user: process.env.DB_USER || 'postgres', // Set default user if not in .env
  host: process.env.DB_HOST || 'localhost', // Set default host if not in .env
  database: process.env.DB_NAME || 'user_details', // Set default database if not in .env
  password: process.env.DB_PASSWORD || 'user', // Set default password if not in .env
  port: process.env.DB_PORT || 5432, // Set default port if not in .env
});

module.exports = pool;
