module.exports = (sequelize, DataTypes) => {
  const Sprint = sequelize.define('Sprint', {
    sprint_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Projects',
        key: 'project_id',
      },
    },
    sprint_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'Sprints',
    timestamps: false,
  });

  Sprint.associate = (models) => {
    Sprint.belongsTo(models.Project, { foreignKey: 'project_id' });
    Sprint.hasMany(models.Task, { foreignKey: 'sprint_id' });
  };

  return Sprint;
};