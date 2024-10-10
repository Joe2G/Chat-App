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
const port = process.env.PORT || 3000; // Change to this

const path = require('path');

// CORS middleware to allow requests from specific origin
app.use(cors({
    origin: 'https://joe2g.github.io',
    methods: ['GET', 'POST'], // Adjust methods as necessary
    credentials: true // Include if you need to support cookies or authentication
}));

app.use(express.json());

const buildPath = path.normalize(path.join(__dirname, '../UI/dist'));
app.use(express.static(buildPath));

// Sync the database models
sequelize.sync()
  .then(() => console.log('Database models synced successfully.'))
  .catch(error => console.error('Error syncing database models:', error));

// API routes
app.use('/api', routes);

// Socket handling
socketHandler(io);

// Cron jobs
cronJob();

// Database connection and sync
dbConnect()
  .then(() => {
    console.log('Database connected successfully.');
    sequelize.sync(); // Sync models after the database connection
  })
  .catch(error => console.error('Error connecting to the database:', error));

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
