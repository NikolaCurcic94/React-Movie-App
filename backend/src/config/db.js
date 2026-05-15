'use strict';
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('PostgreSQL connected');
    client.release();
  } catch (err) {
    console.error('PostgreSQL connection failed:', err.message);
    process.exit(1);
  }
}

module.exports = { pool, testConnection };
