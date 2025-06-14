// tests/mocks/models-index.js
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

// Define models
const User = sequelize.define('User', {}, {});
const Class = sequelize.define('Class', {}, {});
const Group = sequelize.define('Group', {}, {});
const Project = sequelize.define('Project', {}, {});
const ClassMember = sequelize.define('ClassMember', {}, {});
const GroupMember = sequelize.define('GroupMember', {}, {});
const Task = sequelize.define('Task', {}, {});
const TaskChecklist = sequelize.define('TaskChecklist', {}, {});
const Sprint = sequelize.define('Sprint', {}, {});
const TaskComment = sequelize.define('TaskComment', {}, {});
const PeerAssessment = sequelize.define('PeerAssessment', {}, {});
const GitContribution = sequelize.define('GitContribution', {}, {});
const InstructorEvaluation = sequelize.define('InstructorEvaluation', {}, {});
const Commits = sequelize.define('Commits', {}, {});

// Define relationships
User.hasMany(PeerAssessment, { foreignKey: 'assessor_id', as: 'assessmentsGiven' });
PeerAssessment.assessmentTo(User, { foreignKey: 'assessor_id', as: 'assessor' });
User.hasMany(PeerAssessment, { foreignKey: 'assessee_id', as: 'assessmentsReceived' });
PeerAssessment.belongsTo(User, { foreignKey: 'assessee_id', as: 'assessee' });

Group.hasMany(PeerAssessment, { foreignKey: 'group_id', as: 'assessments' });
PeerAssessment.belongsTo(Group, { foreignKey: 'group_id', as: 'group' });

Class.hasMany(Group, { foreignKey: 'class_id' });
Group.belongsTo(Class, { foreignKey: 'class_id' });

Group.hasOne(Project, { foreignKey: 'group_id' });
Project.belongsTo(Group, { foreignKey: 'group_id' });

User.hasMany(Class, { foreignKey: 'instructor_id' });
Class.belongsTo(User, { foreignKey: 'instructor_id', as: 'instructor' });

User.hasMany(Group, { foreignKey: 'leader_id' });
Group.belongsTo(User, { as: 'leader', foreignKey: 'leader_id' });
GroupMember.belongsTo(User, { foreignKey: 'user_id' });

Group.hasMany(GroupMember, { foreignKey: 'group_id', as: 'groupMembers' });
GroupMember.belongsTo(Group, { foreignKey: 'group_id', as: 'group' });

Class.hasMany(ClassMember, { foreignKey: 'class_id' });
ClassMember.belongsTo(Class, { foreignKey: 'class_id' });
User.hasMany(ClassMember, { foreignKey: 'user_id' });
ClassMember.belongsTo(User, { foreignKey: 'user_id' });

Project.hasMany(Sprint, { foreignKey: 'project_id', as: 'sprints' });
Sprint.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });

Sprint.hasMany(Task, { foreignKey: 'sprint_id', as: 'tasks' });
Task.belongsTo(Sprint, { foreignKey: 'sprint_id', as: 'sprint' });

Task.hasMany(TaskChecklist, { foreignKey: 'task_id', as: 'checklists' });
TaskChecklist.belongsTo(Task, { foreignKey: 'task_id', as: 'task' });

Task.hasMany(TaskComment, { foreignKey: 'task_id', as: 'comments' });
TaskComment.belongsTo(Task, { foreignKey: 'task_id', as: 'task' });

Task.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignedUser' });
TaskComment.belongsTo(User, { foreignKey: 'user_id', as: 'author' });

Project.hasMany(GitContribution, { foreignKey: 'project_id', as: 'gitContributions' });
GitContribution.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });

User.hasMany(GitContribution, { foreignKey: 'user_id', as: 'contributions' });
GitContribution.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(InstructorEvaluation, { foreignKey: 'instructor_id', as: 'instructorEvaluationsGiven' });
InstructorEvaluation.belongsTo(User, { foreignKey: 'instructor_id', as: 'instructor' });

User.hasMany(InstructorEvaluation, { foreignKey: 'user_id', as: 'instructorEvaluationsReceived' });
InstructorEvaluation.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Group.hasMany(InstructorEvaluation, { foreignKey: 'group_id', as: 'instructorEvaluations' });
InstructorEvaluation.belongsTo(Group, { foreignKey: 'group_id', as: 'group' });

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
  GitContribution,
  InstructorEvaluation,
  Commits, // Hỗ trợ contributionService.test.js
};