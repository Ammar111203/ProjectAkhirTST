const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Ganti dengan user MySQL Anda
  password: 'root', // Ganti dengan password Anda
  database: 'music_db',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database!');
});

module.exports = db;

