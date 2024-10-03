require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  DATABASE_NAME = 'if0_37434872_XXX',
  DATABASE_USER = 'if0_37434872',
  DATABASE_PASSWORD = 'zVHGQMVtR6K', {
  host: 'sql305.infinityfree.com',
  port: 3306,
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 5, // Maximum number of connections in the pool
    min: 0, // Minimum number of connections in the pool
    acquire: 30000, // Maximum time (in milliseconds) that pool will try to get connection before throwing error
    idle: 10000 // Maximum time (in milliseconds) that a connection can be idle before being released
  }
});

async function dbConnect() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    // Add specific error handling based on error types
  }
}

module.exports = { sequelize, dbConnect };