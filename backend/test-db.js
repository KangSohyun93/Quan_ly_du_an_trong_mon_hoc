const sequelize = require('./config/db-connect');

sequelize.authenticate()
  .then(() => console.log('Kết nối cơ sở dữ liệu thành công'))
  .catch((err) => console.error('Lỗi kết nối cơ sở dữ liệu:', err));