const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

const Chat = sequelize.define('Chat', {
  chatId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensure chat IDs are unique
  },
  userId: {
    type: DataTypes.UUID, // Match the UUID type of userId in User model
    allowNull: false,
  },
}, {
  timestamps: true, // Ensures createdAt and updatedAt fields are automatically added
});

module.exports = Chat;