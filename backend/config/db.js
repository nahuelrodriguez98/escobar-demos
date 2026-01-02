/*require('dotenv').config(); 
const sql = require('pg');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: { encrypt: (process.env.DB_ENCRYPT === 'true') }
};

let pool = null;

async function getPool() {
  if (pool) return pool;
  pool = await sql.connect(config);
  return pool;
}

async function query(queryStr, params = {}) {
  const p = await getPool();
  const req = p.request();

  for (const k of Object.keys(params)) {
    const value = params[k];

    let type;
    if (typeof value === "number") type = sql.Int;
    else if (typeof value === "string") type = sql.VarChar;
    else if (value instanceof Date) type = sql.DateTime;
    else type = sql.VarChar;

    req.input(k, type, value);
  }

  const res = await req.query(queryStr);
  return res;
}

module.exports = { query, sql };
*/
require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function query(text, params = []) {
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (err) {
    console.error("DB QUERY ERROR:", {
      text,
      params,
      code: err.code,
      message: err.message,
    });
    throw err;
  }
}

module.exports = { query };
