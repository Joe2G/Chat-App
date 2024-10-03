const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { dbConnect, sequelize } = require('./config/db');
const cors = require('cors');
const routes = require('./routes/routes');
const socketHandler = require('./socket/socket');
const cronJob = require('./cron/cron');

// Create the Express app and the HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const PORT = 3000;
const path = require('path');

// Middleware to handle CORS and JSON requests
app.use(cors({
  origin: "https://joe2g.github.io/Chat-App/"
}));
app.use(express.json());

// Initialize database connection
dbConnect().catch(error => console.error('Failed to connect to database:', error));

const buildPath = path.normalize(path.join(__dirname, '../UI/dist'));
app.use(express.static(buildPath));

// Sync the database models
sequelize.sync()
  .then(() => console.log('Database models synced successfully.'))
  .catch(error => console.error('Error syncing database models:', error));

// Load routes
app.use('/api', routes);

// Set up Socket.IO
socketHandler(io);

// Start the cron job for deleting old messages
cronJob();

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
