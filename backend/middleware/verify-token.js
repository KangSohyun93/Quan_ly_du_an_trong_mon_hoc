const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Không có token' });
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role; // Thêm dòng này!

    next();
  } catch (error) {
    console.error('Lỗi xác thực token:', error.message);
    return res.status(401).json({ message: 'Token không hợp lệ' });
  }
};