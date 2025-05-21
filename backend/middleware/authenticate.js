const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  // Giả định giải mã token (sử dụng thư viện như jsonwebtoken)
  const decoded = jwt.verify(token, 'your_jwt_secret');
  req.user = { user_id: decoded.user_id, role: decoded.role };
  if (req.user.role !== 'Instructor') {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  next();
};

module.exports = authenticate;