// // const { DataTypes } = require('sequelize');
// // const sequelize = require('../config/db-connect');

// // const Project = sequelize.define('Project', {
// //   project_id: {
// //     type: DataTypes.INTEGER,
// //     primaryKey: true,
// //     autoIncrement: true
// //   },
// //   project_name: {
// //     type: DataTypes.STRING(100),
// //     allowNull: false
// //   },
// //   group_id: {
// //     type: DataTypes.INTEGER,
// //     allowNull: false,
// //     unique: true,
// //     references: {
// //       model: 'Groups',
// //       key: 'group_id'
// //     },
// //     onDelete: 'CASCADE'
// //   },
// //   description: {
// //     type: DataTypes.TEXT
// //   },
// //   tools_used: {
// //     type: DataTypes.TEXT
// //   },
// //   status: {
// //     type: DataTypes.ENUM('Ongoing', 'Completed', 'Cancelled'),
// //     allowNull: false,
// //     defaultValue: 'Ongoing'
// //   },
// //   github_repo_url: {
// //     type: DataTypes.STRING(255)
// //   },
// //   created_at: {
// //     type: DataTypes.DATE,
// //     defaultValue: DataTypes.NOW
// //   }
// // }, {
// //   tableName: 'Projects',
// //   timestamps: false
// // });

// // module.exports = Project;

// // backend/models/ProjectModel.js (Hoặc giữ tên ProjectModel_.js nếu bạn muốn)
// // const { DataTypes } = require('sequelize'); // Sẽ được truyền vào
// // const sequelize = require('../config/db-connect'); // Sẽ được truyền vào

// module.exports = (sequelize, DataTypes) => { // Nhận sequelize và DataTypes
//   const Project = sequelize.define('Project', {
//     project_id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true
//     },
//     project_name: {
//       type: DataTypes.STRING(100),
//       allowNull: false
//     },
//     group_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       unique: true, // Giữ lại unique constraint
//       // references và onDelete sẽ được quản lý bởi association
//     },
//     description: {
//       type: DataTypes.TEXT,
//       allowNull: true, // Cho phép null giống schema
//     },
//     tools_used: {
//       type: DataTypes.TEXT,
//       allowNull: true, // Cho phép null giống schema
//     },
//     status: {
//       type: DataTypes.ENUM('Ongoing', 'Completed', 'Cancelled'),
//       allowNull: false,
//       defaultValue: 'Ongoing'
//     },
//     github_repo_url: {
//       type: DataTypes.STRING(255),
//       allowNull: true, // Cho phép null giống schema
//     },
//     end_date: { // Trường này đã được thêm ở lần sửa trước
//       type: DataTypes.DATEONLY, // DATE trong SQL
//       allowNull: true
//     }
//     // created_at sẽ được quản lý bởi timestamps: true
//   }, {
//     tableName: 'Projects',
//     timestamps: true,         // Cho Sequelize quản lý
//     createdAt: 'created_at',  // Ánh xạ với cột created_at trong DB
//     updatedAt: false,         // Bảng Projects không có cột updated_at theo schema
//   });

//   // Project.associate = function(models) {
//   //   Project.belongsTo(models.Group, { foreignKey: 'group_id' });
//   //   Project.hasMany(models.Sprint, { foreignKey: 'project_id', as: 'sprints' });
//   //   Project.hasMany(models.GitContribution, { foreignKey: 'project_id', as: 'gitContributions' });
//   // };

//   return Project;
// };


const { DataTypes } = require('sequelize');
const sequelize = require('../config/db-connect');

const Project = sequelize.define('Project', {
  project_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  project_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  group_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'Groups',
      key: 'group_id'
    },
    onDelete: 'CASCADE'
  },
  description: {
    type: DataTypes.TEXT
  },
  tools_used: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.ENUM('Ongoing', 'Completed', 'Cancelled'),
    allowNull: false,
    defaultValue: 'Ongoing'
  },
  github_repo_url: {
    type: DataTypes.STRING(255)
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  tableName: 'Projects',
  timestamps: false
});

module.exports = Project;