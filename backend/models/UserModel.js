const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String }, // Thêm nếu muốn lưu tên người dùng
}, { timestamps: true });

// Mã hóa mật khẩu trước khi lưu
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// So sánh mật khẩu
UserSchema.methods.comparePassword = async function (plainPwd) {
  return await bcrypt.compare(plainPwd, this.password);
};

module.exports = mongoose.model('User', UserSchema);
