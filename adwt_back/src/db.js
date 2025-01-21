const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost', // Your server's IP
  user: 'root',            // Your database username
  password: '',  // Your database password
  database: 'adw_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
  
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    return;
  }
  console.log('Connected to MySQL database');


});

module.exports = db;
