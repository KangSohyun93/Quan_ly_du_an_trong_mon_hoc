const { DataTypes } = require("sequelize");
const sequelize = require("../config/db-connect");

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
      // Thêm ràng buộc khóa ngoại
      references: {
        model: "Groups",
        key: "group_id",
      },
      onDelete: "CASCADE",
    },
    assessor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // Thêm ràng buộc khóa ngoại
      references: {
        model: "Users",
        key: "user_id",
      },
      onDelete: "CASCADE",
    },
    assessee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // Thêm ràng buộc khóa ngoại
      references: {
        model: "Users",
        key: "user_id",
      },
      onDelete: "CASCADE",
    },
    // rating: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
    // comment: {
    //   type: DataTypes.TEXT,
    //   allowNull: true,
    // },
    deadline_score: {
      type: DataTypes.INTEGER,
      allowNull: true, // Schema DB không yêu cầu NOT NULL
    },
    friendly_score: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    quality_score: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    team_support_score: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    responsibility_score: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "PeerAssessments",
    timestamps: false,
  }
);

module.exports = PeerAssessment;