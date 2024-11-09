const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const { dbConnect, sequelize } = require('./config/db');
const routes = require('./api');  // Import all routes

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

// Use routes
app.use('/api', routes); // All API routes are prefixed with /api

// Socket handling
socketHandler(io);

// Database connection and server start
const startServer = async () => {
  try {
    await dbConnect();
    console.log('Database models synced successfully.');
    await sequelize.sync();

    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error syncing database models:', error);
  }
};

// Vercel-specific export
module.exports = app; // Export Express app for Vercel