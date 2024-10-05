const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

const Chat = sequelize.define('Chat', {
  chatId: {
    type: DataTypes.STRING(191), // Specify length to match the database index limit
    allowNull: false,
    unique: true, // Ensure chat IDs are unique
  },
  userId: {
    type: DataTypes.UUID, // Match the UUID type of userId in User model
    allowNull: false,
  },
}, {
  timestamps: true, // Ensures createdAt and updatedAt fields are automatically added
  // Optionally, customize the names of the timestamp fields
  // createdAt: 'createdAt', 
  // updatedAt: 'updatedAt',
});

module.exports = Chat;