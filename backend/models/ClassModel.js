const { DataTypes } = require('sequelize');
const sequelize = require('../config/db-connect'); // File config kết nối Sequelize

const Class = sequelize.define('Class', {
  class_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true // Khuyến nghị thêm nếu class_id là tự tăng
  },
  class_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  instructor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', // Tên bảng hoặc model User nếu đã import
      key: 'user_id'
    },
    onDelete: 'RESTRICT'
  },
  semester: {
    type: DataTypes.STRING(10)
  },
  secret_code: {
    type: DataTypes.STRING(10),
    unique: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Classes',
  timestamps: false // Vì bạn đã có `created_at`, không dùng createdAt/updatedAt mặc định
});

module.exports = Class;
