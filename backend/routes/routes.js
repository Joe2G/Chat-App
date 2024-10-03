const express = require('express');
const Chat = require('../models/chat');
const Message = require('../models/message');
const User = require('../models/user');

const router = express.Router();

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

    // If no chats are found, return a message
    if (!chats.length) {
      return res.status(404).json({ message: 'No chats found for this user' });
    }

    // For each chat, fetch the latest message
    const chatsWithLastMessages = await Promise.all(
      chats.map(async (chat) => {
        const lastMessage = await Message.findOne({
          where: { chatId: chat.chatId },
          order: [['timestamp', 'DESC']],
        });

        return {
          chatId: chat.chatId,
          lastMessage: lastMessage ? lastMessage.text : 'No messages yet.',
        };
      })
    );

    res.json(chatsWithLastMessages);
  } catch (error) {
    console.error('Error fetching chats with last messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;