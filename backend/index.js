const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { dbConnect, sequelize } = require('./config/db');
const cors = require('cors');
const routes = require('./routes/routes');
const socketHandler = require('./socket/socket');
const cronJob = require('./cron/cron');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Ensure the port is set correctly
const port = process.env.PORT || 3000;

const path = require('path');

// CORS middleware to allow requests from specific origin
const corsOptions = {
    origin: 'https://joe2g.github.io', // Replace this with the actual frontend URL
    methods: ['GET', 'POST', 'DELETE'], // Adjust methods as necessary
    credentials: true, // Include this if you need to support cookies or authentication
};
app.use(cors(corsOptions)); // Enable CORS with the specified options

// Handle preflight requests for CORS
app.options('*', cors(corsOptions)); // Enable CORS for preflight (OPTIONS) requests on all routes

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
    sequelize.sync();
  })
  .catch(error => console.error('Error syncing database models:', error));

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
