const { Pool } = require('pg');

const pool = new Pool({
  user: 'Chantal_Sql',
  host: 'localhost',
  database: 'api_tareas',
  password: '1234',
  port: 5432,
});

module.exports = pool;