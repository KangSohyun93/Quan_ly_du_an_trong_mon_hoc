const pool = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Đảm bảo thư mục uploads tồn tại
const uploadDir = path.join(__dirname, '../../frontend/public/uploads/');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ cho phép upload file ảnh'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
  },
}).single('avatar');

const getUserProfile = async (req, res) => {
  const { userId } = req.params;
  if (!userId || isNaN(userId)) {
    return res.status(400).json({ error: 'userId không hợp lệ' });
  }

  try {
    console.log(`Truy vấn thông tin người dùng cho userId: ${userId}`);
    const [rows] = await pool.query(
      'SELECT user_id, username, email, avatar FROM Users WHERE user_id = ?',
      [userId]
    );
    if (rows.length === 0) {
      console.warn(`Không tìm thấy người dùng với userId: ${userId}`);
      return res.status(404).json({ error: 'Không tìm thấy người dùng.' });
    }
    console.log('Kết quả truy vấn getUserProfile:', rows[0]);
    res.json(rows[0]);
  } catch (error) {
    console.error('Lỗi trong getUserProfile:', error.message, error.stack);
    res.status(500).json({ error: 'Lỗi server khi lấy thông tin người dùng' });
  }
};

const updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  if (!userId || isNaN(userId)) {
    return res.status(400).json({ error: 'userId không hợp lệ' });
  }

  upload(req, res, async (err) => {
    if (err) {
      console.error('Lỗi upload ảnh:', err.message);
      return res.status(400).json({ error: `Lỗi khi upload ảnh: ${err.message}` });
    }

    try {
      const { username } = req.body;
      const avatarPath = req.file ? `/uploads/${req.file.filename}` : null;

      // Kiểm tra nếu có thay đổi
      const [currentUser] = await pool.query(
        'SELECT username, avatar FROM Users WHERE user_id = ?',
        [userId]
      );
      if (currentUser.length === 0) {
        return res.status(404).json({ error: 'Không tìm thấy người dùng.' });
      }

      const updateData = [];
      const values = [];
      if (username && username !== currentUser[0].username) {
        updateData.push('username = ?');
        values.push(username);
      }
      if (avatarPath && avatarPath !== currentUser[0].avatar) {
        updateData.push('avatar = ?');
        values.push(avatarPath);
      }
      values.push(userId);

      if (updateData.length === 0) {
        return res.json({ success: true, message: 'Không có thay đổi nào được áp dụng' });
      }

      await pool.query(
        `UPDATE Users SET ${updateData.join(', ')}, updated_at = NOW() WHERE user_id = ?`,
        values
      );

      res.json({ success: true, message: 'Cập nhật thông tin thành công' });
    } catch (error) {
      console.error('Lỗi trong updateUserProfile:', error.message, error.stack);
      if (req.file && fs.existsSync(path.join(uploadDir, req.file.filename))) {
        fs.unlinkSync(path.join(uploadDir, req.file.filename)); // Xóa file nếu lỗi
      }
      res.status(500).json({ error: 'Lỗi khi cập nhật thông tin người dùng' });
    }
  });
};

const changePassword = async (req, res) => {
  const { userId } = req.params;
  const { password, newPassword } = req.body;
  if (!userId || isNaN(userId) || !password || !newPassword) {
    return res.status(400).json({ error: 'Dữ liệu không hợp lệ' });
  }

  try {
    console.log(`Đổi mật khẩu cho userId: ${userId}`);
    const [rows] = await pool.query(
      'SELECT password FROM Users WHERE user_id = ?',
      [userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng.' });
    }
    if (rows[0].password !== password) {
      return res.status(401).json({ error: 'Mật khẩu hiện tại không đúng.' });
    }
    // Thêm mã hóa mật khẩu nếu cần (ví dụ: bcrypt)
    await pool.query(
      'UPDATE Users SET password = ?, updated_at = NOW() WHERE user_id = ?',
      [newPassword, userId]
    );
    res.json({ success: true, message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    console.error('Lỗi trong changePassword:', error.message, error.stack);
    res.status(500).json({ error: 'Lỗi khi đổi mật khẩu' });
  }
};

module.exports = { getUserProfile, updateUserProfile, changePassword };