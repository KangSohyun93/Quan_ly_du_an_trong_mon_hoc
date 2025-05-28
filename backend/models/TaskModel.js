module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    task_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sprint_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Sprints',
        key: 'sprint_id',
      },
    },
    assigned_to: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'user_id',
      },
    },
    task_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('To Do', 'In Progress', 'Done'),
      allowNull: false,
      defaultValue: 'To Do',
    },
  }, {
    tableName: 'Tasks',
    timestamps: false,
  });

  Task.associate = (models) => {
    Task.belongsTo(models.Sprint, { foreignKey: 'sprint_id' });
    Task.belongsTo(models.User, { foreignKey: 'assigned_to' });
  };

  return Task;
};