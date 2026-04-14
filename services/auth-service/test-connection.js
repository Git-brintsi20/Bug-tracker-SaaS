const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'postgres',
  host: 'localhost',
  port: 5433,
  database: 'bugtracker',
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Connection error:', err.message);
    process.exit(1);
  } else {
    console.log('Connected successfully:', res.rows[0]);
    process.exit(0);
  }
});
