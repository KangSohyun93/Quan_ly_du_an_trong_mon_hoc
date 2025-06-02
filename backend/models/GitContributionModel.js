// backend/models/GitContributionModel.js
module.exports = (sequelize, DataTypes) => {
  const GitContribution = sequelize.define(
    "GitContribution",
    {
      contribution_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { // Thêm tham chiếu để Sequelize biết về khóa ngoại
          model: 'Projects', // Tên bảng tham chiếu
          key: 'project_id'
        }
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { // Thêm tham chiếu
          model: 'Users',
          key: 'user_id'
        }
      },
      commit_hash: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      commit_message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      lines_added: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      lines_removed: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      commit_date: {
        type: DataTypes.DATE, // Sử dụng DATE hoặc DATETIME tùy theo DB
        allowNull: false,
      }
    },
    {
      tableName: "GitContributions",
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
      indexes: [ // Thêm unique constraint ở đây
        {
          unique: true,
          fields: ['project_id', 'commit_hash']
        }
      ]
    }
  );
  return GitContribution;
};