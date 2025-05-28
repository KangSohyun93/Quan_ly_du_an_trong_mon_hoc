module.exports = (sequelize, DataTypes) => {
  const SystemConfiguration = sequelize.define('SystemConfiguration', {
    config_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    config_key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    config_value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'user_id',
      },
    },
  }, {
    tableName: 'SystemConfigurations',
    timestamps: false,
  });

  SystemConfiguration.associate = (models) => {
    SystemConfiguration.belongsTo(models.User, {
      foreignKey: 'updated_by',
      as: 'updatedBy',
    });
  };

  return SystemConfiguration;
};