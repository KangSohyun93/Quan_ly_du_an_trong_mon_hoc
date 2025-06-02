const Sequelize = require("sequelize");
const sequelize = require("../config/db-connect");

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models - Truyền sequelize và DataTypes
db.User = require("./UserModel")(sequelize, Sequelize.DataTypes);
db.Class = require("./ClassModel")(sequelize, Sequelize.DataTypes);
db.Group = require("./GroupModel")(sequelize, Sequelize.DataTypes);
db.Project = require("./ProjectModel")(sequelize, Sequelize.DataTypes);
db.ClassMember = require("./MemberClassModel")(sequelize, Sequelize.DataTypes);
db.GroupMember = require("./MemberGroupModel")(sequelize, Sequelize.DataTypes);
db.PeerAssessment = require("./PeerAssessmentModel")(sequelize, Sequelize.DataTypes);
db.GitContribution = require("./GitContributionModel")(sequelize, Sequelize.DataTypes);

const taskModels = require("./TaskModel")(sequelize, Sequelize.DataTypes);
db.Task = taskModels.Task;                     // Sử dụng tên model đã chuẩn hóa
db.TaskChecklist = taskModels.TaskChecklist;   // Sử dụng tên model đã chuẩn hóa
db.Sprint = taskModels.Sprint;                 // Sử dụng tên model đã chuẩn hóa
db.TaskComment = taskModels.TaskComment;       // Sử dụng tên model đã chuẩn hóa

db.User.hasMany(db.PeerAssessment, { foreignKey: "assessor_id", as: "assessmentsGiven" });
db.PeerAssessment.belongsTo(db.User, { foreignKey: "assessor_id", as: "assessor" });

db.User.hasMany(db.PeerAssessment, { foreignKey: "assessee_id", as: "assessmentsReceived" });
db.PeerAssessment.belongsTo(db.User, { foreignKey: "assessee_id", as: "assessee" });

db.User.belongsToMany(db.Class, {
  through: db.ClassMember,
  foreignKey: "user_id",
  otherKey: "class_id",
});
db.Class.belongsToMany(db.User, {
  through: db.ClassMember,
  foreignKey: "class_id",
  otherKey: "user_id",
});

db.User.belongsToMany(db.Group, {
  through: db.GroupMember,
  foreignKey: "user_id",
  otherKey: "group_id",
});
db.Group.belongsToMany(db.User, {
  through: db.GroupMember,
  foreignKey: "group_id",
  otherKey: "user_id",
});

db.Class.hasMany(db.Group, { foreignKey: "class_id" });
db.Group.belongsTo(db.Class, { foreignKey: "class_id" });

db.Group.hasOne(db.Project, { foreignKey: "group_id" });
db.Project.belongsTo(db.Group, { foreignKey: "group_id" });

db.User.hasMany(db.Class, { foreignKey: "instructor_id" });
db.Class.belongsTo(db.User, { foreignKey: "instructor_id", as: "instructor" });

db.User.hasMany(db.Group, { foreignKey: "leader_id" });
// Group -> User (leader)
db.Group.belongsTo(db.User, { as: "leader", foreignKey: "leader_id" });
// GroupMember -> User
db.GroupMember.belongsTo(db.User, { foreignKey: "user_id" });

db.Group.hasMany(db.GroupMember, { foreignKey: "group_id", as: "groupMembers" });
db.GroupMember.belongsTo(db.Group, { foreignKey: "group_id", as: "group" });

// Một lớp có nhiều ClassMember
db.Class.hasMany(db.ClassMember, { foreignKey: "class_id" });
db.ClassMember.belongsTo(db.Class, { foreignKey: "class_id" });

// ClassMember liên kết với User
db.User.hasMany(db.ClassMember, { foreignKey: "user_id" });
db.ClassMember.belongsTo(db.User, { foreignKey: "user_id" });

// Relationships with aliases for controller compatibility
db.Project.hasMany(db.Sprint, { foreignKey: "project_id", as: "sprints" });
db.Sprint.belongsTo(db.Project, { foreignKey: "project_id", as: "project" });

db.Sprint.hasMany(db.Task, { foreignKey: "sprint_id", as: "tasks" });
db.Task.belongsTo(db.Sprint, { foreignKey: "sprint_id", as: "sprint" });

db.Task.hasMany(db.TaskChecklist, { foreignKey: "task_id", as: "checklists" });
db.TaskChecklist.belongsTo(db.Task, { foreignKey: "task_id", as: "task" });

db.Task.hasMany(db.TaskComment, { foreignKey: "task_id", as: "comments" });
db.TaskComment.belongsTo(db.Task, { foreignKey: "task_id", as: "task" });

db.Task.belongsTo(db.User, { foreignKey: "assigned_to", as: "assignedUser" });

db.TaskComment.belongsTo(db.User, { foreignKey: "user_id", as: "author" });

// Associations for GitContribution
db.Project.hasMany(db.GitContribution, { foreignKey: "project_id", as: "gitContributions" });
db.GitContribution.belongsTo(db.Project, { foreignKey: "project_id", as: "project" });

db.User.hasMany(db.GitContribution, { foreignKey: "user_id", as: "userContributions" });
db.GitContribution.belongsTo(db.User, { foreignKey: "user_id", as: "user" });

// PeerAssessment <-> Group
db.Group.hasMany(db.PeerAssessment, { foreignKey: "group_id", as: "peerAssessmentsInGroup" });
db.PeerAssessment.belongsTo(db.Group, { foreignKey: "group_id", as: "group" });

module.exports = db;