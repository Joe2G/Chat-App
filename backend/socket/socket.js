const Message = require('../models/message');
const User = require('../models/user');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected');

    // Join chat room
    socket.on('joinChat', (chatId) => {
      socket.join(chatId);
      console.log(`User joined chat: ${chatId}`);
    });

    // Fetch messages for a chat room
    socket.on('getMessages', async ({ chatId }) => {
      try {
        const messages = await Message.findAll({
          where: { chatId },
          order: [['timestamp', 'ASC']],
        });
        socket.emit('getMessages', messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
        socket.emit('error', { message: 'Error fetching messages' });
      }
    });

    // Handle incoming messages
    socket.on('message', async (message) => {
      try {
        const { text, sender, chatId } = message;
        const validChatId = Array.isArray(chatId) ? chatId[0] : chatId;

        const [user] = await User.findOrCreate({
          where: { username: sender.name },
          defaults: { password: sender.id },
        });

        const newMessage = await Message.create({
          text,
          sender: user.username,
          chatId: validChatId,
          userId: user.id,
          timestamp: new Date(),
        });

        io.to(validChatId).emit('message', newMessage);
      } catch (error) {
        console.error('Error saving message:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};
