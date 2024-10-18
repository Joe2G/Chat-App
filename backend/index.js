const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { dbConnect, sequelize } = require('./config/db');
const cors = require('cors');
const routes = require('./routes/routes');
const socketHandler = require('./socket/socket');
const cronJob = require('./cron/cron');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Ensure the port is set correctly
const port = process.env.PORT || 3000;

// CORS middleware to allow requests from specific origin
const corsOptions = {
  origin: 'https://joe2g.github.io',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Enable CORS for all routes
app.use(cors(corsOptions));

// Handle preflight requests for CORS
app.options('*', cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

const buildPath = path.normalize(path.join(__dirname, '../UI/dist'));
app.use(express.static(buildPath));

// API routes
app.use('/api', routes);

// Socket handling
socketHandler(io);

// Cron jobs
cronJob();

// Database connection and sync
dbConnect()
  .then(() => {
    console.log('Database models synced successfully.');
    return sequelize.sync();
  })
  .catch(error => console.error('Error syncing database models:', error));

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});