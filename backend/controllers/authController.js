const jwt = require("jsonwebtoken");
const { User } = require("../models");

const createToken = (user) => {
  return jwt.sign(
    { id: user.user_id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "secret-key",
    { expiresIn: "1d" }
  );
};

exports.register = async (req, res) => {
  try {
    const { email, username, password, role } = req.body;

    const validRoles = ["Student", "Instructor", "Admin"];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({ message: "Vai trò không hợp lệ" });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    const newUser = await User.create({
      username: username,
      email: email,
      password: password,
      role: role,
    });

    res.status(201).json({
      user: {
        id: newUser.user_id,
        email: newUser.email,
        name: newUser.username,
        role: newUser.role,
      },
      message: "Đăng ký tài khoản thành công!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi đăng ký" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "Tài khoản không tồn tại" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch && password !== user.password) {
      return res.status(400).json({ message: "Sai mật khẩu" });
    }

    const token = createToken(user);
    res.status(200).json({
      token,
      user: {
        id: user.user_id,
        name: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi đăng nhập" });
  }
};
