// backend/models/TaskModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db-connect');

const Project = sequelize.define('Projects', {
  project_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  project_name: { type: DataTypes.STRING(100), allowNull: false },
}, {
  timestamps: false,
});

const Task = sequelize.define('Tasks', {
  task_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  project_id: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING(100), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true }, // Added description field
  status: { type: DataTypes.ENUM('To-Do', 'In-Progress', 'Done'), defaultValue: 'To-Do' },
  due_date: { type: DataTypes.DATE, allowNull: true }, // Changed to DATE type
  date: { type: DataTypes.STRING(50) }, // Kept for KanbanView compatibility
  time: { type: DataTypes.STRING(50) }, // Kept for KanbanView compatibility
  avatar: { type: DataTypes.STRING(255) }, // Kept for KanbanView compatibility
}, {
  timestamps: false,
});

const TaskChecklist = sequelize.define('TaskChecklists', {
  checklist_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  task_id: { type: DataTypes.INTEGER, allowNull: false },
  item_description: { type: DataTypes.STRING(255), allowNull: false },
  is_completed: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  timestamps: false,
});

Task.belongsTo(Project, { foreignKey: 'project_id' });
Project.hasMany(Task, { foreignKey: 'project_id' });
Task.hasMany(TaskChecklist, { foreignKey: 'task_id' });
TaskChecklist.belongsTo(Task, { foreignKey: 'task_id' });

module.exports = { Task, TaskChecklist, Project };