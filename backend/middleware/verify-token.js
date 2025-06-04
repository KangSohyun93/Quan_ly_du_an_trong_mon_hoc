const jwt = require("jsonwebtoken");
const { Group } = require("../models");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Auth Header received:", authHeader); 

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Không có token, yêu cầu đăng nhập" });
  }

  const tokenParts = authHeader.split(" ");
  console.log("Token parts after split:", tokenParts); 

  if (tokenParts.length !== 2 || tokenParts[0].toLowerCase() !== 'bearer') { 
    console.error("Token format error: Not Bearer or wrong parts length.");
    return res.status(401).json({ message: "Token không đúng định dạng Bearer." });
  }
  const token = tokenParts[1];
  console.log("Token extracted:", token); 
  console.log("Type of token extracted:", typeof token); 

  if (!token || typeof token !== 'string' || token.trim() === '') { 
    console.error("Token is invalid or missing after extraction.");
    return res.status(401).json({ message: "Token không hợp lệ hoặc bị thiếu sau khi trích xuất." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret-key");

    if (!decoded || typeof decoded.id === 'undefined') {
      console.error("Lỗi giải mã token: payload không chứa trường 'id'.", decoded);
      return res.status(403).json({ message: "Nội dung token không hợp lệ (thiếu id)." });
    }
    if (typeof decoded.role === 'undefined') {
      console.warn("Cảnh báo giải mã token: payload không chứa trường 'role'.", decoded);
    }

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
    console.error("Lỗi xác thực token (jwt.verify failed):", error.name, "-", error.message);
    console.error("Token that caused verify error:", token);
    console.error("Token verification error:", error);

    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: "Token đã hết hạn." });
    }
    if (error.name === 'JsonWebTokenError' && error.message === 'jwt malformed') {
      return res.status(403).json({ message: "Token không hợp lệ: định dạng sai (jwt malformed)." });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: `Token không hợp lệ: ${error.message}` });
    }

    return res
      .status(403)
      .json({ message: "Lỗi xác thực token không xác định." });
  }
};

module.exports = verifyToken;