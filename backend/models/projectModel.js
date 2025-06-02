const { DataTypes } = require('sequelize');
const sequelize = require('../config/db-connect');

const Project = sequelize.define('Project', {
  project_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  project_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  group_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'Groups',
      key: 'group_id'
    },
    onDelete: 'CASCADE'
  },
  description: {
    type: DataTypes.TEXT
  },
  tools_used: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.ENUM('Ongoing', 'Completed', 'Cancelled'),
    allowNull: false,
    defaultValue: 'Ongoing'
  },
  github_repo_url: {
    type: DataTypes.STRING(255)
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  tableName: 'Projects',
  timestamps: false
});

module.exports = Project;
