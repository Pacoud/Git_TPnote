const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "postgres",
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || "devopsdb",
  user: process.env.DB_USER || "devops",
  password: process.env.DB_PASSWORD || "devops"
});

async function query(text, params) {
  return pool.query(text, params);
}

module.exports = {
  pool,
  query
};
