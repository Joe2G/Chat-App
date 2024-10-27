const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const routes = require('./routes/routes');
const socketHandler = require('./socket/socket');
const { dbConnect, sequelize } = require('./config/db');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = process.env.PORT || 3000;

// CORS options
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
dbConnect()
  .then(() => {
    console.log('Database connection established successfully.');
    return sequelize.sync(); // Sync Sequelize models
  })
  .then(() => {
    console.log('Database models synced successfully.');
  })
  .catch((error) => console.error('Error syncing database models:', error));

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
