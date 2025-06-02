const { DataTypes } = require('sequelize');
const sequelize = require('../config/db-connect'); // Ensure this path is correct

const GitContribution = sequelize.define('GitContribution', 
  {
    contribution_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { // Kept for consistency with your provided ProjectModel.js
        model: 'Projects', // Table name
        key: 'project_id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { // Kept for consistency
        model: 'Users',    // Table name
        key: 'user_id'
      }
    },
    commit_hash: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    commit_message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    lines_added: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lines_removed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    commit_date: {
      type: DataTypes.DATE, // SQL DATETIME
      allowNull: false,
    },
    created_at: { // Explicitly define created_at as seen in your new ProjectModel and TaskComment
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW // Sequelize will use its NOW function
    }
  },
  {
    tableName: "GitContributions", // Explicitly set the table name
    timestamps: false,          // Disable Sequelize's automatic timestamp management (createdAt, updatedAt)
    indexes: [
      {
        unique: true,
        fields: ['project_id', 'commit_hash']
      }
    ]
  }
);

module.exports = GitContribution;