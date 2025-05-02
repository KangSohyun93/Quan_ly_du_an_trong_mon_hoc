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
    cb(null, uniqueSuffix + '-' + file.originalname);
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
  try {
    console.log(`Truy vấn thông tin người dùng cho userId: ${userId}`);
    const [rows] = await pool.query(
      `
      SELECT user_id, username, email, avatar
      FROM Users
      WHERE user_id = ?;
      `,
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
    res.status(500).json({ error: `Lỗi khi lấy thông tin người dùng: ${error.message}` });
  }
};

const updateUserProfile = async (req, res) => {
  const { userId } = req.params;

  upload(req, res, async (err) => {
    if (err) {
      console.error('Lỗi upload ảnh:', err.message);
      return res.status(400).json({ error: `Lỗi khi upload ảnh: ${err.message}` });
    }

    try {
      const { username } = req.body;
      const avatarPath = req.file ? `/uploads/${req.file.filename}` : null;
      console.log(`Cập nhật thông tin người dùng cho userId: ${userId}, username: ${username}, avatar: ${avatarPath}`);

      await pool.query(
        `
        UPDATE Users
        SET username = ?, avatar = COALESCE(?, avatar)
        WHERE user_id = ?;
        `,
        [username || null, avatarPath, userId]
      );

      res.json({ success: true });
    } catch (error) {
      console.error('Lỗi trong updateUserProfile:', error.message, error.stack);
      res.status(500).json({ error: `Lỗi khi cập nhật thông tin người dùng: ${error.message}` });
    }
  });
};

const changePassword = async (req, res) => {
  const { userId } = req.params;
  const { password, newPassword } = req.body;
  try {
    console.log(`Đổi mật khẩu cho userId: ${userId}`);
    const [rows] = await pool.query(
      `
      SELECT password
      FROM Users
      WHERE user_id = ?;
      `,
      [userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng.' });
    }
    if (rows[0].password !== password) {
      return res.status(401).json({ error: 'Mật khẩu hiện tại không đúng.' });
    }
    await pool.query(
      `
      UPDATE Users
      SET password = ?
      WHERE user_id = ?;
      `,
      [newPassword, userId]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Lỗi trong changePassword:', error.message, error.stack);
    res.status(500).json({ error: `Lỗi khi đổi mật khẩu: ${error.message}` });
  }
};

module.exports = { getUserProfile, updateUserProfile, changePassword };