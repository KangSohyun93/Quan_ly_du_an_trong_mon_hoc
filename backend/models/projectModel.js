module.exports = (sequelize, DataTypes) => {
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
    end_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'Projects',
    timestamps: true,     
    createdAt: 'created_at',
    updatedAt: false,     
  });
  return Project;
};