const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Class = sequelize.define('Class', {
    class_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    class_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    semester: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    secret_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    instructor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'user_id',
      },
    },
  }, {
    tableName: 'Classes',
    timestamps: false,
  });

  return Class;
};