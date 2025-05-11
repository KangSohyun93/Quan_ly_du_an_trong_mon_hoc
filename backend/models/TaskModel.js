// backend/models/TaskModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db-connect');

const Project = sequelize.define('Projects', {
  project_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  project_name: { type: DataTypes.STRING(100), allowNull: false },
  group_id: { type: DataTypes.INTEGER, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  tools_used: { type: DataTypes.TEXT, allowNull: true },
  status: { type: DataTypes.ENUM('Ongoing', 'Completed', 'Cancelled'), defaultValue: 'Ongoing' },
  github_repo_url: { type: DataTypes.STRING(255), allowNull: true },
}, {
  timestamps: false,
});

const Sprint = sequelize.define('Sprints', {
  sprint_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  project_id: { type: DataTypes.INTEGER, allowNull: false },
  sprint_number: { type: DataTypes.INTEGER, allowNull: false },
  sprint_name: { type: DataTypes.STRING(100), allowNull: true },
  start_date: { type: DataTypes.DATE, allowNull: true },
  end_date: { type: DataTypes.DATE, allowNull: true },
}, {
  timestamps: false,
});

const Task = sequelize.define('Tasks', {
  task_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  sprint_id: { type: DataTypes.INTEGER, allowNull: false }, // Changed to sprint_id
  title: { type: DataTypes.STRING(100), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  status: { type: DataTypes.ENUM('To-Do', 'In-Progress', 'Completed'), defaultValue: 'To-Do' }, // Updated status enum
  due_date: { type: DataTypes.DATE, allowNull: true },
  completed_at: { type: DataTypes.DATE, allowNull: true },
  progress_percentage: { type: DataTypes.INTEGER, defaultValue: 0 }, // Changed to INTEGER
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

// Define relationships
Project.hasMany(Sprint, { foreignKey: 'project_id' });
Sprint.belongsTo(Project, { foreignKey: 'project_id' });
Sprint.hasMany(Task, { foreignKey: 'sprint_id' });
Task.belongsTo(Sprint, { foreignKey: 'sprint_id' });
Task.hasMany(TaskChecklist, { foreignKey: 'task_id' });
TaskChecklist.belongsTo(Task, { foreignKey: 'task_id' });

module.exports = { Task, TaskChecklist, Project, Sprint };