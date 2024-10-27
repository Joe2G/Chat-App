const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const routes = require('./routes/routes');
const socketHandler = require('./socket/socket');
const { dbConnect, sequelize } = require('./config/db');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = process.env.PORT || 3000;

// CORS 
const corsOptions = {
  origin: 'https://joe2g.github.io',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../UI/dist')));

// API routes
app.use('/api', routes);

// Socket handling
socketHandler(io);

// Health check endpoint (optional)
app.get('/health', (req, res) => {
  res.status(200).send('Server is healthy');
});

// Database connection
dbConnect()
  .then(() => {
    console.log('Database connection established successfully.');
    return sequelize.sync(); // Sync Sequelize models
  })
  .then(() => {
    console.log('Database models synced successfully.');
    // Start the server to listen for incoming requests
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error syncing database models:', error);
    process.exit(1); // Exit the process on error, if needed
  });
