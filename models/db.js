/**
 * Name: Avery Killian
 * Date: 10.30.2025
 * CSC 372-01
 *
 * Sets up connection pool for Postgres/Neon.
 */

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

module.exports = pool;
