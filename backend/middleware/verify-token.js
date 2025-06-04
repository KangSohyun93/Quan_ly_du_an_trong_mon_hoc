const jwt = require("jsonwebtoken");
const { Group } = require("../models");

const verifyToken = async (req, res, next) => {
  // Lấy token từ header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Không có token, yêu cầu đăng nhập" });
  }

  const token = authHeader.split(" ")[1]; // 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret-key");
    req.userId = decoded.id;
    req.user = decoded;

    const group = await Group.findOne({ where: { leader_id: req.userId } });
    req.isTeamLead = !!group || (decoded.role && decoded.role.toLowerCase() === "admin"); // Sửa lại kiểm tra role admin

    // LOG QUAN TRỌNG ĐỂ DEBUG
    console.log("\n--- SERVER LOG: Inside verifyToken middleware ---");
    console.log("Timestamp:", new Date().toISOString());
    console.log("User ID from token:", req.userId);
    console.log("User role from token:", decoded.role);
    console.log("Group found for leader_id:", group ? JSON.stringify(group.toJSON()) : null);
    console.log("req.isTeamLead determined as:", req.isTeamLead);
    // KẾT THÚC LOG QUAN TRỌNG

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res
      .status(403)
      .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

module.exports = verifyToken;
