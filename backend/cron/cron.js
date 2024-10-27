import { Op } from 'sequelize'; // Import Op from Sequelize
import Message from '../models/message'; // Adjust the import based on your folder structure
import { sequelize } from '../config/db'; // Adjust the import based on your folder structure

export default async function handler(req, res) {
  // Check authorization
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end('Unauthorized');
  }

  // Define the time threshold for deleting messages
  const twoDaysAgo = new Date();
  twoDaysAgo.setHours(twoDaysAgo.getHours() - 48);

  try {
    await sequelize.authenticate();
    const result = await Message.destroy({
      where: {
        timestamp: {
          [Op.lt]: twoDaysAgo,
        },
      },
    });

    console.log(`${result} old messages deleted.`);
    console.log(`Messages deleted before: ${twoDaysAgo}`);
    
    res.status(200).end(`${result} old messages deleted.`);
  } catch (error) {
    if (error.name === 'SequelizeDatabaseError') {
      console.error('Database error deleting old messages:', error);
      return res.status(500).end('Database error');
    } else {
      console.error('Error deleting old messages:', error);
      return res.status(500).end('Internal server error');
    }
  }
}
