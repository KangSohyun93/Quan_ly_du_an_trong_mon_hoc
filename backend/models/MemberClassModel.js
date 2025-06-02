module.exports = (sequelize, DataTypes) => { // Nhận sequelize và DataTypes
  const ClassMember = sequelize.define('ClassMember', {
    class_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      // references và onDelete sẽ được Sequelize quản lý thông qua associations
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      // references và onDelete sẽ được Sequelize quản lý thông qua associations
    }
  }, {
    tableName: 'ClassMembers',
    timestamps: true, // Khuyến nghị: để Sequelize quản lý created_at (sẽ là joined_at) và updated_at
    updatedAt: false, // Nếu không có cột updatedAt
    createdAt: 'joined_at' // Ánh xạ createdAt của Sequelize với cột joined_at trong DB
  });

  return ClassMember;
};