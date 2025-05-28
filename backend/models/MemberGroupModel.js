module.exports = (sequelize, DataTypes) => {
  const GroupMember = sequelize.define('GroupMember', {
    group_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Groups',
        key: 'group_id',
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
    tableName: 'GroupMembers',
    timestamps: false,
  });

  GroupMember.associate = (models) => {
    GroupMember.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return GroupMember;
};