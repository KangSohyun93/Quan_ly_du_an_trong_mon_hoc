const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => { // Thay đổi để nhận sequelize và DataTypes
  const User = sequelize.define(
    "User",
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("Student", "Instructor", "Admin"),
        allowNull: false,
      },
      github_email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: true,
        validate: {
          isEmail: true, // Sequelize sẽ tự kiểm tra nếu đây là email hợp lệ
        }
      },
      github_username: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      avatar: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      tableName: "Users",
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  User.beforeCreate(async (user, options) => {
    if (user.password) { // Chỉ hash nếu password được cung cấp/thay đổi
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  // Hook này nên dùng cho beforeUpdate nếu muốn hash password khi cập nhật
  User.beforeUpdate(async (user, options) => {
    if (user.changed('password')) { // Chỉ hash nếu trường password thực sự thay đổi
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });


  User.prototype.comparePassword = async function (inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
  };
  return User;
};