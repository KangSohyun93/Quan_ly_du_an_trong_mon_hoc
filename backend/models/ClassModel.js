// module.exports = (sequelize, DataTypes) => { // Nhận sequelize và DataTypes
//   const Class = sequelize.define('Class', {
//     class_id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       // autoIncrement: true, // DB schema của bạn class_id INT PRIMARY KEY, không có auto_increment
//       // Nếu bạn muốn nó tự tăng, cần sửa DB và thêm ở đây.
//       // Hiện tại giữ theo DB schema.
//     },
//     class_name: {
//       type: DataTypes.STRING(50),
//       allowNull: false
//     },
//     instructor_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       // references và onDelete sẽ được Sequelize quản lý thông qua associations
//     },
//     semester: {
//       type: DataTypes.STRING(10)
//     },
//     secret_code: {
//       type: DataTypes.STRING(10),
//       unique: true
//     }
//   }, {
//     tableName: 'Classes',
//     timestamps: true,
//     createdAt: 'created_at',
//     updatedAt: false,
//   });

//   return Class;
// };
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