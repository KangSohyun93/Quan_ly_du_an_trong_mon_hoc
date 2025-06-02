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