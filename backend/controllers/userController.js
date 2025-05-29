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
