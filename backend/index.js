const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const routes = require('./routes/routes');
const socketHandler = require('./socket/socket');
const { dbConnect, sequelize } = require('./config/db');
const path = require('path');
const cron = require('node-cron'); // Import the cron library
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: 'https://joe2g.github.io',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.static(path.join(__dirname, '../UI/dist')));

// API routes
app.use('/api', routes);

// Socket handling
socketHandler(io);

// Database connection
const startServer = async () => {
  try {
    await dbConnect();
    console.log('Database models synced successfully.');
    await sequelize.sync();

    // Schedule cron job to delete old messages every day at midnight
    cron.schedule('0 0 * * *', async () => {
      try {
        await deleteOldMessages(); // Call your delete function
        console.log('Cron job executed: Old messages deleted.');
      } catch (error) {
        console.error('Error executing cron job:', error);
      }
    });

    // Start the server
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error syncing database models:', error);
  }
};

// Start the server and database connection
startServer();
