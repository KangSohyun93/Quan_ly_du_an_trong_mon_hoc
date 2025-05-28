module.exports = (sequelize, DataTypes) => {
  const ClassMember = sequelize.define('ClassMember', {
    class_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Classes',
        key: 'class_id',
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Users',
        key: 'user_id',
      },
    },
  }, {
    tableName: 'ClassMembers',
    timestamps: false,
  });

  return ClassMember;
};