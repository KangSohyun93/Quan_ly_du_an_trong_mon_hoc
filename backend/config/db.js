const mysql = require('mysql2/promise');

// Tạo pool kết nối tới MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', 
  password: 'Sohyun280697.', // Thay bằng password MySQL của bạn
  database: 'project_management', // Tên database của bạn
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;