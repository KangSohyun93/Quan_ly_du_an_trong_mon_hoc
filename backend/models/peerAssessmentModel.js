const { DataTypes } = require("sequelize");
const sequelize = require("../config/db-connect"); // File config kết nối Sequelize
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
    },
    assessor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    assessee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
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
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "PeerAssessments", // <- Phải đúng với tên bạn đặt trong DB
    timestamps: false,
  }
);

module.exports = PeerAssessment;