const { User } = require("../models");

exports.fetchUser = async (req, res) => {
  try {
    const userId = req.userId; // Lấy user_id từ token đã xác thực
    const user = await User.findOne({
      where: { user_id: userId },
      attributes: ["user_id", "username", "role", "avatar"],
    });

    if (!user) {
      return res.status(404).json({ error: "Người dùng không tồn tại" });
    }

    res.json(user);
  } catch (error) {
    console.error("Lỗi trong fetchUser:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};
exports.fetchUserData = async (req, res) => {
  try {
    const userId = req.params.userId; // Lấy user_id từ tham số URL
    const user = await User.findOne({
      where: { user_id: userId },
      attributes: [
        "user_id",
        "username",
        "email",
        "role",
        "created_at",
        "is_active",
        "avatar",
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "Người dùng không tồn tại" });
    }

    res.json(user);
  } catch (error) {
    console.error("Lỗi trong fetchUser:", error);
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
