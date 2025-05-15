// middleware/verifyToken.js
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
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
    // console.log("🧪 decoded token:", decoded); // xem id có đúng không
    req.userId = decoded.id; // Gán userId vào req
    next(); // Cho phép tiếp tục vào controller
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

module.exports = verifyToken;
