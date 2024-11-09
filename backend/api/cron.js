const express = require('express');
const deleteOldMessages = require('../cron/cron');

const router = express.Router();

router.post('/cron', async (req, res) => {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end('Unauthorized');
  }
  
  await deleteOldMessages();
  res.status(200).end('Cron job executed successfully.');
});

module.exports = router;
