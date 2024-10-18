const express = require('express');
const bcrypt = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ctfkjrdhhrkmztzcrwub.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey);

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

    // Insert user into Supabase
    const { data, error } = await supabase
      .from('Users') // Ensure this matches your Supabase table name
      .insert([{ username, password: hashedPassword }]);

    if (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.status(201).json(data);
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

    // Insert chat into Supabase
    const { data, error } = await supabase
      .from('Chats') // Ensure this matches your Supabase table name
      .insert([{ chatId, userId }]);

    if (error) {
      console.error('Error creating chat:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to delete a specific chat
router.delete('/chats/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;

    // Delete chat from Supabase
    const { data, error } = await supabase
      .from('Chats') // Ensure this matches your Supabase table name
      .delete()
      .eq('chatId', chatId);

    if (error) {
      console.error('Error deleting chat:', error);
      return res.status(404).json({ error: 'Chat not found or error deleting chat' });
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

    // Fetch chats for the user from Supabase
    const { data, error } = await supabase
      .from('Chats') // Ensure this matches your Supabase table name
      .select('*')
      .eq('userId', userId);

    if (error) {
      console.error('Error fetching chats:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (!data.length) {
      return res.status(404).json({ message: 'No chats found for this user' });
    }

    res.json(data);
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
    const { data: chats, error: chatError } = await supabase
      .from('Chats')
      .select('*')
      .eq('userId', userId);

    if (chatError) {
      console.error('Error fetching chats:', chatError);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (!chats.length) {
      return res.status(404).json({ message: 'No chats found for this user' });
    }

    const chatsWithLastMessages = await Promise.all(
      chats.map(async (chat) => {
        // Fetch the last message for each chat
        const { data: lastMessage, error: messageError } = await supabase
          .from('Messages') // Ensure this matches your Supabase table name
          .select('*')
          .eq('chatId', chat.chatId)
          .order('timestamp', { ascending: false })
          .limit(1);

        if (messageError) {
          console.error('Error fetching last message:', messageError);
          return {
            chatId: chat.chatId,
            lastMessage: { text: 'Error fetching last message.' },
          };
        }

        return {
          chatId: chat.chatId,
          lastMessage: lastMessage.length
            ? {
                text: lastMessage[0].text,
                senderId: lastMessage[0].senderId,
                timestamp: lastMessage[0].timestamp,
              }
            : { text: 'No messages yet.' },
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