module.exports = (sequelize, DataTypes) => { // Thay đổi để nhận sequelize và DataTypes
  const PeerAssessment = sequelize.define(
    "PeerAssessment",
    {
      assessment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Groups', key: 'group_id' } // Sẽ được tạo bởi association
      },
      assessor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'user_id' }
      },
      assessee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'user_id' }
      },
      // Xóa trường rating cũ nếu không còn sử dụng
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      deadline_score: {
        type: DataTypes.INTEGER,
        allowNull: true, // Hoặc false nếu bắt buộc
        validate: { min: 0, max: 5 } // Ví dụ thang điểm
      },
      friendly_score: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: { min: 0, max: 5 }
      },
      quality_score: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: { min: 0, max: 5 }
      },
      team_support_score: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: { min: 0, max: 5 }
      },
      responsibility_score: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: { min: 0, max: 5 }
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      }
    },
    {
      tableName: "PeerAssessments",
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );
  return PeerAssessment;
};