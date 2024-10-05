const express = require('express');
const { dbConnect, sequelize } = require('./config/db');
const cors = require('cors'); // Import the cors package
const app = express();

// Custom CORS middleware function with specific configurations
const cors = require('cors');
app.use(cors());

app.use(express.json());
const buildPath = path.normalize(path.join(__dirname, '../UI/dist'));
sequelize.sync()
app.use('/api', routes);
socketHandler(io);
cronJob();
const http = require('http');
const socketIO = require('socket.io');
const routes = require('./routes/routes');
const socketHandler = require('./socket/socket');
const cronJob = require('./cron/cron');

// Create the Express app and the HTTP server
const server = http.createServer(app);
const io = socketIO(server);
const PORT = 3000;
const path = require('path');

// Initialize database connection
dbConnect().catch(error => console.error('Failed to connect to database:', error))
  .then(() => console.log('Database models synced successfully.'))
  .catch(error => console.error('Error syncing database models:', error));

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});