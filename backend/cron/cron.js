const cron = require('node-cron');
const { Op } = require('sequelize'); // Import Op from sequelize
const Message = require('../models/message');
const { sequelize } = require('../config/db');

module.exports = () => {
  cron.schedule('0 * * * *', async () => {
    const twoDaysAgo = new Date();
    twoDaysAgo.setHours(twoDaysAgo.getHours() - 48);

    try {
      const result = await Message.destroy({
        where: {
          timestamp: {
            [Op.lt]: twoDaysAgo, // Use Op.lt instead of sequelize.Op.lt
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