module.exports = (sequelize, DataTypes) => { // Nhận sequelize và DataTypes
  const GroupMember = sequelize.define('GroupMember', {
    group_id: {
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
    tableName: 'GroupMembers',
    timestamps: true, // Khuyến nghị
    updatedAt: false, // Nếu không có cột updatedAt
    createdAt: 'joined_at' // Ánh xạ createdAt của Sequelize với cột joined_at trong DB
  });

  return GroupMember;
};