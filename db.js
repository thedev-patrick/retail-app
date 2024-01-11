const mysql = require('mysql2');

// Create a pool of database connections
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'retail-app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export the pool for shared use across the application
module.exports = pool.promise();
