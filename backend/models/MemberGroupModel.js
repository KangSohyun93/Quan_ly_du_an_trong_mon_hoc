// module.exports = (sequelize, DataTypes) => { // Nhận sequelize và DataTypes
//   const GroupMember = sequelize.define('GroupMember', {
//     group_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       primaryKey: true,
//       // references và onDelete sẽ được Sequelize quản lý thông qua associations
//     },
//     user_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       primaryKey: true,
//       // references và onDelete sẽ được Sequelize quản lý thông qua associations
//     }
//   }, {
//     tableName: 'GroupMembers',
//     timestamps: true, // Khuyến nghị
//     updatedAt: false, // Nếu không có cột updatedAt
//     createdAt: 'joined_at' // Ánh xạ createdAt của Sequelize với cột joined_at trong DB
//   });

//   return GroupMember;
// };

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db-connect');

const GroupMember = sequelize.define('GroupMember', {
  group_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'Groups',
      key: 'group_id'
    },
    onDelete: 'CASCADE'
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'Users',
      key: 'user_id'
    },
    onDelete: 'CASCADE'
  },
  joined_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'GroupMembers',
  timestamps: false
});

module.exports = GroupMember;