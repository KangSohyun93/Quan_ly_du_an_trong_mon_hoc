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
