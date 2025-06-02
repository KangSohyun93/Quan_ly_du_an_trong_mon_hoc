module.exports = (sequelize, DataTypes) => { // Nhận sequelize và DataTypes
  const Class = sequelize.define('Class', {
    class_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      // autoIncrement: true, // DB schema của bạn class_id INT PRIMARY KEY, không có auto_increment
      // Nếu bạn muốn nó tự tăng, cần sửa DB và thêm ở đây.
      // Hiện tại giữ theo DB schema.
    },
    class_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    instructor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // references và onDelete sẽ được Sequelize quản lý thông qua associations
    },
    semester: {
      type: DataTypes.STRING(10)
    },
    secret_code: {
      type: DataTypes.STRING(10),
      unique: true
    }
  }, {
    tableName: 'Classes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  });

  return Class;
};