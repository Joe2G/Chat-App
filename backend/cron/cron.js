const cron = require('node-cron');
const { Op } = require('sequelize'); // Import Op from sequelize
const Message = require('../models/message');
const { sequelize } = require('../config/db');

module.exports = () => {
  cron.schedule('0 * * * *', async () => {
    console.log("Running scheduled job to delete old messages...");

    const twoDaysAgo = new Date();
    twoDaysAgo.setHours(twoDaysAgo.getHours() - 48);

    try {
      // Check if the database connection is still valid
      await sequelize.authenticate();

      const result = await Message.destroy({
        where: {
          timestamp: {
            [Op.lt]: twoDaysAgo, // Use Op.lt for querying
          },
        },
      });

      console.log(`${result} old messages deleted.`);
      console.log(`Messages deleted before: ${twoDaysAgo}`);

    } catch (error) {
      if (error.name === 'SequelizeDatabaseError') {
        console.error('Database error deleting old messages:', error);
      } else {
        console.error('Error deleting old messages:', error);
      }
    }
  });
};
