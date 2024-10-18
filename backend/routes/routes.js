const express = require('express');
const bcrypt = require('bcrypt');
const Chat = require('../models/chat');
const Message = require('../models/message');
const User = require('../models/user');

const router = express.Router();

// Route to create a new user
router.post('/users', async (req, res) => {
  try {
    const { username } = req.body;
    const password = 'userid'; // Set the password as specified
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const newUser = await User.create({ username, password: hashedPassword });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to create a new chat
router.post('/chats', async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    if (!chatId || !userId) {
      return res.status(400).json({ error: 'Chat ID and user ID are required' });
    }

    const newChat = await Chat.create({ chatId, userId });
    res.status(201).json(newChat);
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to delete a specific chat
router.delete('/chats/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;
    const deletedChat = await Chat.destroy({ where: { chatId } });

    if (!deletedChat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    res.status(200).json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to fetch all chats for a specific user
router.get('/users/:userId/chats', async (req, res) => {
  try {
    const { userId } = req.params;
    const chats = await Chat.findAll({ where: { userId } });

    if (!chats.length) {
      return res.status(404).json({ message: 'No chats found for this user' });
    }

    res.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to fetch chats along with the last message
router.get('/users/:userId/chats/last-messages', async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch all chats for the user
    const chats = await Chat.findAll({ where: { userId } });

    if (!chats.length) {
      return res.status(404).json({ message: 'No chats found for this user' });
    }

    const chatsWithLastMessages = await Promise.all(
      chats.map(async (chat) => {
        const lastMessage = await Message.findOne({
          where: { chatId: chat.chatId },
          order: [['timestamp', 'DESC']],
        });

        return {
          chatId: chat.chatId,
          lastMessage: lastMessage ? {
            text: lastMessage.text,
            senderId: lastMessage.senderId,
            timestamp: lastMessage.timestamp,
          } : { text: 'No messages yet.' },
        };
      })
    );

    res.json({ success: true, data: chatsWithLastMessages });
  } catch (error) {
    console.error('Error fetching chats with last messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;