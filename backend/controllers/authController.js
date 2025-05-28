const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const register = async (req, res) => {
  try {
    const { email, username, password, role } = req.body;
    if (!email || !username || !password || !role) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
      role,
    });

    // Đăng ký
    const token = jwt.sign(
      { userId: user.user_id, role: user.role }, // Thêm role vào payload
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(201).json({ message: 'Đăng ký thành công', token });
  } catch (error) {
    console.error('Lỗi trong register:', error.message, error.stack);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Thiếu email hoặc mật khẩu' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    // Đăng nhập
    const token = jwt.sign(
      { userId: user.user_id, role: user.role }, // Thêm role vào payload
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(200).json({ 
      message: 'Đăng nhập thành công', 
      token,
        userId: user.user_id, 
      role: user.role
    });
  } catch (error) {
    console.error('Lỗi trong login:', error.message, error.stack);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
module.exports = { register, login };