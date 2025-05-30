const Sequelize = require("sequelize");
const sequelize = require("../config/db-connect"); // File config kết nối Sequelize

// Import models
const User = require("./UserModel");
const Class = require("./ClassModel");
const Group = require("./GroupModel");
const Project = require("./ProjectModel");
const ClassMember = require("./MemberClassModel");
const GroupMember = require("./MemberGroupModel");
const { Task, TaskChecklist, Sprint, TaskComment } = require("./TaskModel");
const PeerAssessment = require("./peerAssessmentModel");
// Define associations
User.hasMany(PeerAssessment, {
  foreignKey: "assessor_id",
  as: "assessmentsGiven",
});
PeerAssessment.belongsTo(User, {
  foreignKey: "assessor_id",
  as: "assessor",
});
User.hasMany(PeerAssessment, {
  foreignKey: "assessee_id",
  as: "assessmentsReceived",
});
PeerAssessment.belongsTo(User, {
  foreignKey: "assessee_id",
  as: "assessee",
});

User.belongsToMany(Class, {
  through: ClassMember,
  foreignKey: "user_id",
  otherKey: "class_id",
});
Class.belongsToMany(User, {
  through: ClassMember,
  foreignKey: "class_id",
  otherKey: "user_id",
});

User.belongsToMany(Group, {
  through: GroupMember,
  foreignKey: "user_id",
  otherKey: "group_id",
});
Group.belongsToMany(User, {
  through: GroupMember,
  foreignKey: "group_id",
  otherKey: "user_id",
});

Class.hasMany(Group, { foreignKey: "class_id" });
Group.belongsTo(Class, { foreignKey: "class_id" });

Group.hasOne(Project, { foreignKey: "group_id" });
Project.belongsTo(Group, { foreignKey: "group_id" });

User.hasMany(Class, { foreignKey: "instructor_id" });
Class.belongsTo(User, { foreignKey: "instructor_id", as: "instructor" });

User.hasMany(Group, { foreignKey: "leader_id" });
// Group -> User (leader)
Group.belongsTo(User, { as: "leader", foreignKey: "leader_id" });
// GroupMember -> User
GroupMember.belongsTo(User, { foreignKey: "user_id" });

Group.hasMany(GroupMember, { foreignKey: "group_id", as: "groupMembers" });
GroupMember.belongsTo(Group, { foreignKey: "group_id", as: "group" });

// Một lớp có nhiều ClassMember
Class.hasMany(ClassMember, { foreignKey: "class_id" });
ClassMember.belongsTo(Class, { foreignKey: "class_id" });

// ClassMember liên kết với User
User.hasMany(ClassMember, { foreignKey: "user_id" });
ClassMember.belongsTo(User, { foreignKey: "user_id" });

// Relationships with aliases for controller compatibility
Project.hasMany(Sprint, { foreignKey: "project_id", as: "sprints" });
Sprint.belongsTo(Project, { foreignKey: "project_id", as: "project" });

Sprint.hasMany(Task, { foreignKey: "sprint_id", as: "tasks" });
Task.belongsTo(Sprint, { foreignKey: "sprint_id", as: "sprint" });

Task.hasMany(TaskChecklist, { foreignKey: "task_id", as: "checklists" });
TaskChecklist.belongsTo(Task, { foreignKey: "task_id", as: "task" });

Task.hasMany(TaskComment, { foreignKey: "task_id", as: "comments" });
TaskComment.belongsTo(Task, { foreignKey: "task_id", as: "task" });

Task.belongsTo(User, { foreignKey: "assigned_to", as: "assignedUser" });

TaskComment.belongsTo(User, { foreignKey: "user_id", as: "author" });
// Export models & sequelize
module.exports = {
  sequelize,
  Sequelize,
  User,
  Class,
  Group,
  Project,
  ClassMember,
  GroupMember,
  Task,
  TaskChecklist,
  Sprint,
  TaskComment,
  PeerAssessment,
};
