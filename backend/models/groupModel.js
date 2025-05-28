module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    group_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    group_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    group_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    class_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Classes',
        key: 'class_id',
      },
    },
    leader_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'user_id',
      },
    },
  }, {
    tableName: 'Groups',
    timestamps: false,
  });

  Group.associate = (models) => {
    Group.belongsToMany(models.User, {
      through: models.GroupMember,
      foreignKey: 'group_id',
      otherKey: 'user_id',
    });
    Group.belongsTo(models.Class, { foreignKey: 'class_id' });
    Group.hasOne(models.Project, { foreignKey: 'group_id' });
    Group.belongsTo(models.User, { as: 'leader', foreignKey: 'leader_id' });
    Group.hasMany(models.PeerAssessment, { foreignKey: 'group_id' });
    Group.hasMany(models.GroupMember, { foreignKey: 'group_id', as: 'groupMembers' });
  };

  return Group;
};