const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }
);

const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Successfully connected to the MySQL database');
  } catch (error) {
    console.error('Failed to connect to the MySQL database:', error);
  }
};

connection();

module.exports = sequelize;