require('dotenv').config();
const { Sequelize } = require('sequelize');

// Initialize Sequelize with PostgreSQL (Supabase uses Postgres)
const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: 'postgres', // Set the dialect to postgres
    logging: false, // Disable logging; set to true if you want Sequelize logs
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Database connection function
async function dbConnect() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    // Enhanced error handling for different database connection errors
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