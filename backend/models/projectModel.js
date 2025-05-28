module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    project_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    project_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Groups',
        key: 'group_id',
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tools_used: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    github_repo_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'Projects',
    timestamps: false,
  });

  Project.associate = (models) => {
    Project.belongsTo(models.Group, { foreignKey: 'group_id' });
    Project.hasMany(models.Sprint, { foreignKey: 'project_id' });
  };

  return Project;
};