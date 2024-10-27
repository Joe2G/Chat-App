const express = require('express');
const http = require('http');
const cors = require('cors');
const routes = require('./routes/routes');
const { dbConnect, sequelize } = require('./config/db'); // Ensure this import is only present once
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Use environment variable for port or fallback to 3000 (for local testing)
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

// API routes
app.use('/api', routes);

// Health check endpoint (optional)
app.get('/health', (req, res) => {
  res.status(200).send('Server is healthy');
});

// Database connection and model syncing
(async () => {
  try {
    await dbConnect(); // Connect to the database
    console.log('Database connection established successfully.');

    await sequelize.sync(); // Sync Sequelize models
    console.log('Database models synced successfully.');
  } catch (error) {
    console.error('Error during startup:', error);
    process.exit(1); // Exit the process on error
  }
})();

// Export the express app and server for use in socket handling
module.exports = { app, server };
