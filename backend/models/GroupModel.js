module.exports = (sequelize, DataTypes) => { // Nhận sequelize và DataTypes
  const Group = sequelize.define('Group', {
    group_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    group_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    class_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // references và onDelete sẽ được Sequelize quản lý thông qua associations
    },
    leader_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // references và onDelete sẽ được Sequelize quản lý thông qua associations
    },
    group_number: {
      type: DataTypes.INTEGER,
      allowNull: false // Trigger trong DB sẽ xử lý việc gán giá trị
    }
  }, {
    tableName: 'Groups', // Chú ý tên bảng trong DB là `Groups` (có dấu `)
    timestamps: true,     
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ['class_id', 'group_number']
      }
    ]
  });

  return Group;
};