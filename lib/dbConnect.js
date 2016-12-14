const pg = require('pg-promise')({});

const config = process.env.DATABASE_URL || {
  host:       process.env.DB_HOST,
  port:       process.env.DB_PORT,
  database:   'senate_viz',
  user:       process.env.DB_USER,
  password:   process.env.DB_PASS,
}

const db = pg(config);

module.exports = db;
