// // // // middleware/verifyToken.js
// // // const jwt = require("jsonwebtoken");

// // // const verifyToken = (req, res, next) => {
// // //   // Lấy token từ header
// // //   const authHeader = req.headers.authorization;

// // //   if (!authHeader) {
// // //     return res
// // //       .status(401)
// // //       .json({ message: "Không có token, yêu cầu đăng nhập" });
// // //   }

// // //   const token = authHeader.split(" ")[1]; // 'Bearer <token>'

// // //   if (!token) {
// // //     return res.status(401).json({ message: "Token không hợp lệ" });
// // //   }

// // //   try {
// // //     const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret-key");
// // //     // console.log("🧪 decoded token:", decoded); // xem id có đúng không
// // //     req.userId = decoded.id; // Gán userId vào req
// // //     req.user = decoded;
// // //     next(); // Cho phép tiếp tục vào controller
// // //   } catch (error) {
// // //     return res
// // //       .status(403)
// // //       .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
// // //   }
// // // };

// // // module.exports = verifyToken;

// // // middleware/verifyToken.js
// // const jwt = require("jsonwebtoken");

// // const verifyToken = (req, res, next) => {
// //   const authHeader = req.headers.authorization;

// //   if (!authHeader) {
// //     return res
// //       .status(401)
// //       .json({ message: "Không có token, yêu cầu đăng nhập" });
// //   }

// //   const tokenParts = authHeader.split(" ");
// //   if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
// //     return res.status(401).json({ message: "Token không đúng định dạng Bearer." });
// //   }
// //   const token = tokenParts[1];

// //   if (!token) {
// //     return res.status(401).json({ message: "Token không hợp lệ hoặc bị thiếu." });
// //   }

// //   try {
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret-key");
// //     // Gán tường minh để đảm bảo req.user có cấu trúc mong đợi
// //     if (!decoded || typeof decoded.id === 'undefined' || typeof decoded.role === 'undefined') {
// //       console.error("Lỗi giải mã token: payload không chứa id hoặc role.", decoded);
// //       // Trả về lỗi 403 nếu payload không như mong đợi, thay vì để lỗi ở controller sau
// //       return res.status(403).json({ message: "Nội dung token không hợp lệ." });
// //     }
// //     req.user = {
// //       userId: decoded.id,
// //       role: decoded.role
// //       // Bạn có thể thêm các trường khác từ decoded vào req.user nếu cần
// //       // username: decoded.username,
// //       // email: decoded.email
// //     };
// //     // req.userId = decoded.id; // Có thể bỏ nếu dùng req.user.id
// //     next();
// //   } catch (error) {
// //     console.error("Lỗi xác thực token:", error.name, "-", error.message); // Log tên lỗi và message

// //     if (error.name === 'TokenExpiredError') {
// //       return res.status(403).json({ message: "Token đã hết hạn." });
// //     }
// //     if (error.name === 'JsonWebTokenError') {
// //       return res.status(403).json({ message: `Token không hợp lệ: ${error.message}` });
// //     }

// //     // Các lỗi khác
// //     return res
// //       .status(403)
// //       .json({ message: "Lỗi xác thực token không xác định." });
// //   }
// // };

// // module.exports = verifyToken;

// // middleware/verifyToken.js
// const jwt = require("jsonwebtoken");

// const verifyToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res
//       .status(401)
//       .json({ message: "Không có token, yêu cầu đăng nhập" });
//   }

//   const tokenParts = authHeader.split(" ");
//   if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
//     return res.status(401).json({ message: "Token không đúng định dạng Bearer." });
//   }
//   const token = tokenParts[1];

//   if (!token) {
//     return res.status(401).json({ message: "Token không hợp lệ hoặc bị thiếu." });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret-key");

//     // Kiểm tra xem payload (decoded) có chứa các trường cần thiết không
//     if (!decoded || typeof decoded.id === 'undefined') {
//       console.error("Lỗi giải mã token: payload không chứa trường 'id'.", decoded);
//       return res.status(403).json({ message: "Nội dung token không hợp lệ (thiếu id)." });
//     }
//     // Kiểm tra thêm trường role nếu các controller khác cũng cần req.user.role
//     if (typeof decoded.role === 'undefined') {
//       console.warn("Cảnh báo giải mã token: payload không chứa trường 'role'.", decoded);
//       // Bạn có thể quyết định trả lỗi ở đây nếu role là bắt buộc cho MỌI request đã xác thực
//       // return res.status(403).json({ message: "Nội dung token không hợp lệ (thiếu role)." });
//     }

//     // Gán trực tiếp theo cách cũ của bạn
//     req.userId = decoded.id;  // Controller sẽ dùng cái này để lấy ID
//     req.user = decoded;       // Controller có thể dùng req.user.role để lấy vai trò

//     // Để debug:
//     // console.log("Decoded payload:", decoded);
//     // console.log("req.userId set to:", req.userId);
//     // console.log("req.user set to:", req.user);

//     next();
//   } catch (error) {
//     console.error("Lỗi xác thực token:", error.name, "-", error.message);

//     if (error.name === 'TokenExpiredError') {
//       return res.status(403).json({ message: "Token đã hết hạn." });
//     }
//     if (error.name === 'JsonWebTokenError') {
//       return res.status(403).json({ message: `Token không hợp lệ: ${error.message}` });
//     }

//     return res
//       .status(403)
//       .json({ message: "Lỗi xác thực token không xác định." });
//   }
// };

// module.exports = verifyToken;

// middleware/verifyToken.js
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Auth Header received:", authHeader); // << CHECK 1

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Không có token, yêu cầu đăng nhập" });
  }

  const tokenParts = authHeader.split(" ");
  console.log("Token parts after split:", tokenParts); // << CHECK 2

  if (tokenParts.length !== 2 || tokenParts[0].toLowerCase() !== 'bearer') { // Đổi thành toLowerCase() cho 'bearer'
    console.error("Token format error: Not Bearer or wrong parts length.");
    return res.status(401).json({ message: "Token không đúng định dạng Bearer." });
  }
  const token = tokenParts[1];
  console.log("Token extracted:", token); // << CHECK 3: Đây là giá trị quan trọng nhất
  console.log("Type of token extracted:", typeof token); // << CHECK 4

  if (!token || typeof token !== 'string' || token.trim() === '') { // Thêm kiểm tra chuỗi rỗng
    console.error("Token is invalid or missing after extraction.");
    return res.status(401).json({ message: "Token không hợp lệ hoặc bị thiếu sau khi trích xuất." });
  }

  try {
    // Trước khi verify, hãy thử decode cơ bản để xem cấu trúc (chỉ zu zu debug, không dùng cho xác thực)
    // try {
    //   const [headerB64, payloadB64, signatureB64] = token.split('.');
    //   if (headerB64 && payloadB64 && signatureB64) {
    //     console.log("Decoded Header (approx):", Buffer.from(headerB64, 'base64').toString());
    //     console.log("Decoded Payload (approx):", Buffer.from(payloadB64, 'base64').toString());
    //   } else {
    //     console.warn("Token does not seem to have 3 parts.");
    //   }
    // } catch (e) {
    //   console.warn("Could not manually decode token parts:", e.message);
    // }

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

    next();
  } catch (error) {
    console.error("Lỗi xác thực token (jwt.verify failed):", error.name, "-", error.message);
    // Log thêm cả cái token gây lỗi
    console.error("Token that caused verify error:", token);

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