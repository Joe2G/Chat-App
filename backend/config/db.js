const { Sequelize } = require('sequelize');

// Database connection details
const DB_NAME = 'sql5735433'; // Database name
const DB_USER = 'sql5735433'; // Database user
const DB_PASSWORD = 'Vg4NaZUxVc'; // Database password
const DB_HOST = 'sql5.freemysqlhosting.net'; // Database host
const DB_PORT = 3306; // Database port

// Sequelize instance
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql2',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});
// Database connection function
async function dbConnect() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    // Enhanced error handling
    if (error instanceof Sequelize.ConnectionError) {
      console.error('Database connection error:', error.message);
    } else if (error instanceof Sequelize.HostNotFoundError) {
      console.error('Database host not found:', error.message);
    } else if (error instanceof Sequelize.InvalidConnectionError) {
      console.error('Invalid database credentials:', error.message);
    } else if (error instanceof Sequelize.TimeoutError) {
      console.error('Database connection timeout:', error.message);
    } else {
      console.error('Unable to connect to the database:', error.message);
    }
  }
}

module.exports = { sequelize, dbConnect };