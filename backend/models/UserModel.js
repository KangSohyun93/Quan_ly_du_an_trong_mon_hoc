module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('Student', 'Instructor', 'Admin'),
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'users',
    timestamps: false,
  });

  User.associate = (models) => {
    User.hasMany(models.Class, { foreignKey: 'instructor_id' });
    User.hasMany(models.Group, { foreignKey: 'leader_id', as: 'leader' });
    User.hasMany(models.PeerAssessment, { foreignKey: 'assessor_id', as: 'assessor' });
    User.hasMany(models.PeerAssessment, { foreignKey: 'assessee_id', as: 'assessee' });
    User.hasMany(models.ClassMember, { foreignKey: 'user_id' });
    User.hasMany(models.GroupMember, { foreignKey: 'user_id' });
  };

  return User;
};