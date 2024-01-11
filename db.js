const mysql = require('mysql2');
require("dotenv").config();

// Create a pool of database connections
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export the pool for shared use across the application
module.exports = pool.promise();
