const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

const Message = sequelize.define('Message', {
  text: {
    type: DataTypes.STRING(2000), // Set a maximum character limit
    allowNull: false,
  },
  sender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  chatId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID, // Match the UUID type of userId in User model
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true, // Ensures createdAt and updatedAt fields are automatically added
});

module.exports = Message;