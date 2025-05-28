const { User } = require('../models');
const bcrypt = require('bcryptjs');

// Định nghĩa hàm thông thường thay vì exports.functionName
const getUserProfile = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const authUserId = req.userId; // Lấy từ middleware verifyToken
    if (isNaN(userId) || userId <= 0) {
      return res.status(400).json({ message: 'userId phải là số nguyên dương' });
    }
    if (userId !== authUserId && req.userRole !== 'Admin') {
      return res.status(403).json({ message: 'Không có quyền truy cập hồ sơ này' });
    }

    const user = await User.findOne({
      where: { user_id: userId },
      attributes: ['user_id', 'email', 'username', 'role', 'avatar'],
    });

    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Lỗi trong getUserProfile:', error.message, error.stack);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const authUserId = req.userId;
    const { username, avatar } = req.body;

    if (isNaN(userId) || userId <= 0) {
      return res.status(400).json({ message: 'userId phải là số nguyên dương' });
    }
    if (userId !== authUserId) {
      return res.status(403).json({ message: 'Không có quyền cập nhật hồ sơ này' });
    }
    if (!username && !avatar) {
      return res.status(400).json({ message: 'Cần cung cấp ít nhất username hoặc avatar' });
    }

    const user = await User.findOne({ where: { user_id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    const updates = {};
    if (username) updates.username = username;
    if (avatar) updates.avatar = avatar;

    await user.update(updates);
    res.status(200).json({ message: 'Hồ sơ đã được cập nhật' });
  } catch (error) {
    console.error('Lỗi trong updateUserProfile:', error.message, error.stack);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const authUserId = req.userId;
    const { oldPassword, newPassword } = req.body;

    if (isNaN(userId) || userId <= 0 || !oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
    }
    if (userId !== authUserId) {
      return res.status(403).json({ message: 'Không có quyền thay đổi mật khẩu này' });
    }

    const user = await User.findOne({ where: { user_id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu cũ không đúng' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    res.status(200).json({ message: 'Mật khẩu đã được thay đổi' });
  } catch (error) {
    console.error('Lỗi trong changePassword:', error.message, error.stack);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

module.exports = { getUserProfile, updateUserProfile, changePassword };