const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db-connect');

const Task = sequelize.define('Tasks', {
  task_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  project_id: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING(100), allowNull: false },
  status: { type: DataTypes.ENUM('To-Do', 'In-Progress', 'Done'), defaultValue: 'To-Do' },
  date: { type: DataTypes.STRING(50) }, // Added for KanbanView
  time: { type: DataTypes.STRING(50) }, // Added for KanbanView
  avatar: { type: DataTypes.STRING(255) }, // Added for KanbanView
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

Task.hasMany(TaskChecklist, { foreignKey: 'task_id' });
TaskChecklist.belongsTo(Task, { foreignKey: 'task_id' });

module.exports = { Task, TaskChecklist };