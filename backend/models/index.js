const Sequelize = require('sequelize');
const sequelize = require('../config/db-connect');

const models = {
  User: require('./UserModel')(sequelize, Sequelize.DataTypes),
  Class: require('./ClassModel')(sequelize, Sequelize.DataTypes),
  Group: require('./GroupModel')(sequelize, Sequelize.DataTypes),
  Project: require('./ProjectModel')(sequelize, Sequelize.DataTypes),
  ClassMember: require('./MemberClassModel')(sequelize, Sequelize.DataTypes),
  GroupMember: require('./MemberGroupModel')(sequelize, Sequelize.DataTypes),
  Sprint: require('./SprintModel')(sequelize, Sequelize.DataTypes),
  Task: require('./TaskModel')(sequelize, Sequelize.DataTypes),
  PeerAssessment: require('./PeerAssessmentModel')(sequelize, Sequelize.DataTypes),
  SystemConfiguration: require('./SystemConfigurationModel')(sequelize, Sequelize.DataTypes),
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = { sequelize, Sequelize, ...models };