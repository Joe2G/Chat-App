const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const routes = require('./routes/routes');
const socketHandler = require('./socket/socket');
const cronJob = require('./cron/cron');
const { dbConnect, sequelize } = require('./config/db');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const PORT = 3000;

// Allowed domains for CORS
const allowedOrigins = [
  'https://joe2g.github.io/Chat-App',
  'https://joe2g.github.io',
  'https://chat-app-khaki-zeta.vercel.app'
];

// Enable CORS for specific origins
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Enable this if your requests include credentials like cookies
}));

// Handle preflight requests
app.options('*', cors());

// Middleware
app.use(express.json());

// Serve static frontend files
const buildPath = path.normalize(path.join(__dirname, '../UI/dist'));
app.use(express.static(buildPath));

// API routes
app.use('/api', routes);

// Serve frontend if no API route matches
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

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
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});