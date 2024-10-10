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
const port = 3000 || process.env.PORT;
const path = require('path');

app.use(cors({
  origin: '*', // Allow all origins
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Explicitly specify allowed headers
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
    console.log('Database models synced successfully.');
    sequelize.sync();
  })
  .catch(error => console.error('Error syncing database models:', error));

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
