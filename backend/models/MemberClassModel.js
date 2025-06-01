const { DataTypes } = require('sequelize');
const sequelize = require('../config/db-connect');

const ClassMember = sequelize.define('ClassMember', {
  class_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'Classes',
      key: 'class_id'
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
  tableName: 'ClassMembers',
  timestamps: false
});

module.exports = ClassMember;
