module.exports = (sequelize, DataTypes) => { // Nhận sequelize và DataTypes
  // Sprint Model
  const Sprint = sequelize.define(
    "Sprint", // Đổi tên model từ "Sprints" thành "Sprint" cho nhất quán
    {
      sprint_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      project_id: { type: DataTypes.INTEGER, allowNull: false },
      sprint_number: { type: DataTypes.INTEGER, allowNull: false }, // Trigger sẽ xử lý gán giá trị
      sprint_name: { type: DataTypes.STRING(100) },
      start_date: { type: DataTypes.DATE },
      end_date: { type: DataTypes.DATE },
      // created_at từ DB schema sẽ được quản lý bởi timestamps nếu bật
    },
    {
      tableName: 'Sprints', // Giữ nguyên tên bảng
      timestamps: true, // Khuyến nghị bật
      updatedAt: false, // Nếu không có cột updatedAt
      createdAt: 'created_at' // Ánh xạ với cột created_at trong DB
      // (DB schema có created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
    }
  );

  // Task Model
  const Task = sequelize.define(
    "Task", // Đổi tên model từ "Tasks" thành "Task"
    {
      task_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      sprint_id: { type: DataTypes.INTEGER, allowNull: false },
      title: { type: DataTypes.STRING(100), allowNull: false },
      description: { type: DataTypes.TEXT },
      assigned_to: { type: DataTypes.INTEGER }, // onDelete SET NULL được xử lý ở DB
      status: {
        type: DataTypes.ENUM("To-Do", "In-Progress", "Completed"),
        defaultValue: "To-Do",
        allowNull: false, // Khớp với DB schema
      },
      due_date: { type: DataTypes.DATE }, // DB schema là DATETIME
      completed_at: { type: DataTypes.DATE }, // DB schema là DATETIME
      progress_percentage: { type: DataTypes.INTEGER, defaultValue: 0 },
      // created_at từ DB schema sẽ được quản lý bởi timestamps nếu bật
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
    "TaskChecklist", // Đổi tên model
    {
      checklist_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      task_id: { type: DataTypes.INTEGER, allowNull: false },
      item_description: { type: DataTypes.STRING(255), allowNull: false },
      is_completed: { type: DataTypes.BOOLEAN, defaultValue: false },
      // created_at từ DB schema sẽ được quản lý bởi timestamps nếu bật
    },
    {
      tableName: 'TaskChecklists',
      timestamps: true,
      updatedAt: false,
      createdAt: 'created_at'
    }
  );

  // Task Comment Model
  const TaskComment = sequelize.define(
    "TaskComment", // Đổi tên model
    {
      comment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      task_id: { type: DataTypes.INTEGER, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      comment_text: { type: DataTypes.TEXT, allowNull: false },
      created_at: { // DB schema chỉ có created_at
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // Sẽ được quản lý bởi timestamps nếu timestamps: true
      },
    },
    {
      tableName: 'TaskComments',
      timestamps: true,
      updatedAt: false, // Vì DB schema không có updated_at
      createdAt: 'created_at' // Ánh xạ với cột created_at trong DB
    }
  );

  return { Task, TaskChecklist, Sprint, TaskComment };
};