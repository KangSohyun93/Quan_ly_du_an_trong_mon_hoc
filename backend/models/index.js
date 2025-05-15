const Sequelize = require('sequelize');
const sequelize = require('../config/db-connect'); // File config kết nối Sequelize

// Import models
const User = require('./UserModel')
const Class = require('./ClassModel')
const Group = require('./GroupModel')
const Project = require('./ProjectModel')
const ClassMember = require('./MemberClassModel')
const GroupMember = require('./MemberGroupModel')

// Thiết lập mối quan hệ
User.belongsToMany(Class, {
  through: ClassMember,
  foreignKey: 'user_id',
  otherKey: 'class_id'
});
Class.belongsToMany(User, {
  through: ClassMember,
  foreignKey: 'class_id',
  otherKey: 'user_id'
});

User.belongsToMany(Group, {
  through: GroupMember,
  foreignKey: 'user_id',
  otherKey: 'group_id'
});
Group.belongsToMany(User, {
  through: GroupMember,
  foreignKey: 'group_id',
  otherKey: 'user_id'
});

Class.hasMany(Group, { foreignKey: 'class_id' });
Group.belongsTo(Class, { foreignKey: 'class_id' });

Group.hasOne(Project, { foreignKey: 'group_id' });
Project.belongsTo(Group, { foreignKey: 'group_id' });

User.hasMany(Class, { foreignKey: 'instructor_id' });
Class.belongsTo(User, { foreignKey: 'instructor_id' });

User.hasMany(Group, { foreignKey: 'leader_id' });
// Group -> User (leader)
Group.belongsTo(User, { as: 'leader', foreignKey: 'leader_id' });
// GroupMember -> User
GroupMember.belongsTo(User, { foreignKey: 'user_id' });


// Export models & sequelize
module.exports = {
  sequelize,
  Sequelize,
  User,
  Class,
  Group,
  Project,
  ClassMember,
  GroupMember
};
