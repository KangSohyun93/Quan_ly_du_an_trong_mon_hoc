const mysql = require('mysql2'); // Import thư viện mysql2

// Đây là đối tượng cấu hình bạn đã có
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'CR2809ie:)', // Hãy cẩn thận khi đưa password vào code, nên dùng biến môi trường
  database: 'project_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Thêm charset để hỗ trợ tiếng Việt tốt hơn
  charset: 'utf8mb4' // Quan trọng nếu bạn có dữ liệu tiếng Việt
};

// Tạo một connection pool
const pool = mysql.createPool(dbConfig);

// Export pool.promise() để sử dụng async/await
module.exports = pool.promise();