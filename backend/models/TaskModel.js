const { DataTypes } = require("sequelize");
const sequelize = require("../config/db-connect");

// Sprint Model
const Sprint = sequelize.define(
  "Sprints",
  {
    sprint_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    project_id: { type: DataTypes.INTEGER, allowNull: false },
    sprint_number: { type: DataTypes.INTEGER, allowNull: false },
    sprint_name: { type: DataTypes.STRING(100) },
    start_date: { type: DataTypes.DATE },
    end_date: { type: DataTypes.DATE },
  },
  {
    tableName: 'Sprints',
    timestamps: false,
  }
);

// Task Model
const Task = sequelize.define(
  "Tasks",
  {
    task_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    sprint_id: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.TEXT },
    assigned_to: { type: DataTypes.INTEGER },
    status: {
      type: DataTypes.ENUM("To-Do", "In-Progress", "Completed"),
      defaultValue: "To-Do",
      allowNull: false,
    },
    due_date: { type: DataTypes.DATE },
    completed_at: { type: DataTypes.DATE },
    progress_percentage: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    tableName: 'Tasks',
    timestamps: true,
    updatedAt: false,
    createdAt: 'created_at'
  }
);

// Task Checklist Model
const TaskChecklist = sequelize.define(
  "TaskChecklists",
  {
    checklist_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    task_id: { type: DataTypes.INTEGER, allowNull: false },
    item_description: { type: DataTypes.STRING(255), allowNull: false },
    is_completed: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    tableName: 'TaskChecklists',
    timestamps: false,
  }
);

// Task Comment Model
const TaskComment = sequelize.define(
  "TaskComments",
  {
    comment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    task_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    comment_text: { type: DataTypes.TEXT, allowNull: false },
    // created_at được quản lý bởi DB (DEFAULT CURRENT_TIMESTAMP)
  },
  {
    tableName: 'TaskComments',
    timestamps: false, // Giữ false nếu DB tự quản lý created_at cho bảng này
  }
);

module.exports = { Task, TaskChecklist, Sprint, TaskComment };
// --- END OF FILE TaskModel.js ---