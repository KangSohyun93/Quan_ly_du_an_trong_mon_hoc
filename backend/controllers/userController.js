const { User } = require("../models");
const bcrypt = require("bcryptjs");
const path = require("path"); // Thêm path để xử lý đường dẫn file
exports.fetchUser = async (req, res) => {
  try {
    const userId = req.userId; // Lấy user_id từ token đã xác thực
    const user = await User.findOne({
      where: { user_id: userId },
      attributes: ["user_id", "username", "role", "avatar", "github_email", "github_username"],
    });

    if (!user) {
      return res.status(404).json({ error: "Người dùng không tồn tại" });
    }

    // Đảm bảo avatar có giá trị hợp lệ
    const userData = {
      user_id: user.user_id,
      username: user.username,
      role: user.role,
      avatar: user.avatar ? `http://localhost:5000${user.avatar}` : null,
      github_email: user.github_email,
      github_username: user.github_username,
    };

    res.json(userData);
  } catch (error) {
    console.error("Lỗi trong fetchUser:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

// controllers/userController.js
exports.fetchUserData = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findOne({
      where: { user_id: userId },
      attributes: ["user_id", "username", "email", "role", "created_at", "is_active", "avatar", "github_email", "github_username"],
    });

    if (!user) {
      return res.status(404).json({ error: "Người dùng không tồn tại" });
    }

    const userData = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      is_active: user.is_active,
      avatar: user.avatar ? `http://localhost:5000${user.avatar}` : null,
      github_email: user.github_email,
      github_username: user.github_username,
    };

    res.json(userData);
  } catch (error) {
    console.error("Lỗi trong fetchUserData:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

exports.fetchAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        "user_id",
        "username",
        "email",
        "role",
        "created_at",
        "is_active",
      ],
    });
    console.log("Lấy tất cả người dùng:", users);
    if (!users || users.length === 0) {
      return res.status(404).json({ error: "Không có người dùng nào" });
    }

    res.json(users);
  } catch (error) {
    console.error("Lỗi trong fetchAllUsers:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.userId; // Lấy user_id từ tham số URL
    const { role, is_active } = req.body;

    // Kiểm tra xem người dùng có tồn tại không
    const user = await User.findOne({ where: { user_id: userId } });
    if (!user) {
      return res.status(404).json({ error: "Người dùng không tồn tại" });
    }

    // Cập nhật thông tin người dùng
    user.role = role;
    user.is_active = is_active;
    await user.save();

    res.json(user);
  } catch (error) {
    console.error("Lỗi trong updateUser:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Kiểm tra xem người dùng đã tồn tại chưa
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email đã được sử dụng" });
    }

    // Tạo người dùng mới
    const newUser = await User.create({
      username,
      email,
      password, // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
      role,
      is_active: 1, // Mặc định là hoạt động
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Lỗi trong createUser:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const authUserId = req.userId; // Lấy từ middleware verifyToken
    if (isNaN(userId) || userId <= 0) {
      return res.status(400).json({ message: "userId phải là số nguyên dương" });
    }
    if (userId !== authUserId && req.userRole !== "Admin") {
      return res.status(403).json({ message: "Không có quyền truy cập hồ sơ này" });
    }

    const user = await User.findOne({
      where: { user_id: userId },
      attributes: ["user_id", "email", "username", "role", "avatar", "github_email", "github_username"], // Thêm github_email và github_username
    });

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Lỗi trong getUserProfile:", error.message, error.stack);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const authUserId = req.userId;
    const { username, github_email, github_username } = req.body;
    const avatar = req.file ? `/uploads/${req.file.filename}` : undefined; // Lấy đường dẫn file từ multer

    if (isNaN(userId) || userId <= 0) {
      return res.status(400).json({ message: "userId phải là số nguyên dương" });
    }
    if (userId !== authUserId) {
      return res.status(403).json({ message: "Không có quyền cập nhật hồ sơ này" });
    }

    const user = await User.findOne({ where: { user_id: userId } });
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    const updates = {};
    if (username) updates.username = username;
    if (github_email) updates.github_email = github_email;
    if (github_username) updates.github_username = github_username;
    if (avatar) updates.avatar = avatar; // Lưu đường dẫn avatar

    // Kiểm tra nếu không có dữ liệu để cập nhật
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "Cần cung cấp ít nhất username, avatar, github_email hoặc github_username" });
    }

    await user.update(updates);
    res.status(200).json({
      message: "Hồ sơ đã được cập nhật",
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        github_email: user.github_email,
        github_username: user.github_username,
      },
    });
  } catch (error) {
    console.error("Lỗi trong updateUserProfile:", error.message, error.stack);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const authUserId = req.userId;
    const { oldPassword, newPassword } = req.body;

    if (isNaN(userId) || userId <= 0 || !oldPassword || !newPassword) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
    }
    if (userId !== authUserId) {
      return res.status(403).json({ message: "Không có quyền thay đổi mật khẩu này" });
    }

    const user = await User.findOne({ where: { user_id: userId } });
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu cũ không đúng" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    res.status(200).json({ message: "Mật khẩu đã được thay đổi" });
  } catch (error) {
    console.error("Lỗi trong changePassword:", error.message, error.stack);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};