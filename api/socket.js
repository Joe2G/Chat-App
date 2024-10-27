const { Server } = require('socket.io');
const initializeSocket = require('../backend/socket/socket'); // Import your existing socket handling code

module.exports = (req, res) => {
  const io = new Server(res.socket.server);

  if (!res.socket.server.io) {
    // Attach the Socket.IO server to the HTTP server only once
    res.socket.server.io = io;

    // Initialize the socket handling
    initializeSocket(io);
  }

  // Respond to the initial request
  res.json({ message: 'Socket.IO server initialized.' });
};
