// module.exports = (sequelize, DataTypes) => { // Nhận sequelize và DataTypes
//   const Group = sequelize.define('Group', {
//     group_id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true
//     },
//     group_name: {
//       type: DataTypes.STRING(50),
//       allowNull: false
//     },
//     class_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       // references và onDelete sẽ được Sequelize quản lý thông qua associations
//     },
//     leader_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       // references và onDelete sẽ được Sequelize quản lý thông qua associations
//     },
//     group_number: {
//       type: DataTypes.INTEGER,
//       allowNull: false // Trigger trong DB sẽ xử lý việc gán giá trị
//     }
//   }, {
//     tableName: 'Groups', // Chú ý tên bảng trong DB là `Groups` (có dấu `)
//     timestamps: true,     
//     createdAt: 'created_at',
//     updatedAt: false,
//     indexes: [
//       {
//         unique: true,
//         fields: ['class_id', 'group_number']
//       }
//     ]
//   });

//   return Group;
// };

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db-connect'); // File config kết nối Sequelize

const Group = sequelize.define('Group', {
  group_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  group_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  class_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Classes',
      key: 'class_id'
    },
    onDelete: 'CASCADE'
  },
  leader_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'user_id'
    },
    onDelete: 'RESTRICT'
  },
  group_number: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Groups',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['class_id', 'group_number']
    }
  ]
});

module.exports = Group;