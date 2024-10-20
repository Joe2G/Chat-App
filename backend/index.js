const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const socketHandler = require('./socket/socket');
const cronJob = require('./cron/cron');
const { dbConnect, sequelize } = require('./config/db');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = process.env.PORT || 3000;

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// CORS options
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

// API routes from external routes file
app.use('/api', routes);

// Socket handling
socketHandler(io);

// Cron jobs
cronJob();

// Database connection
dbConnect()
  .then(() => {
    console.log('Database models synced successfully.');
    return sequelize.sync();
  })
  .catch(error => console.error('Error syncing database models:', error));

// Test connection route
app.get('/api/test-connection', async (req, res) => {
  try {
    res.status(200).send('Hello World');
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to create a new user
app.post('/api/users', async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const hashedPassword = await bcrypt.hash('userid', 10); // Hash the password

    // Insert user into Supabase
    const { data, error } = await supabase
      .from('Users')
      .insert([{ username, password: hashedPassword }]);

    if (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Error creating user in Supabase' });
    }

    res.status(201).json({ message: 'User created successfully', data });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to create a new chat
app.post('/api/chats', async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    if (!chatId || !userId) {
      return res.status(400).json({ error: 'Chat ID and user ID are required' });
    }

    // Insert chat into Supabase
    const { data, error } = await supabase
      .from('Chats')
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
app.delete('/api/chats/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;

    // Delete chat from Supabase
    const { data, error } = await supabase
      .from('Chats')
      .delete()
      .eq('chatId', chatId);

    if (error) {
      console.error('Error deleting chat:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.status(200).json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to fetch all chats for a specific user
app.get('/api/users/:userId/chats', async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch chats for the user from Supabase
    const { data, error } = await supabase
      .from('Chats')
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
app.get('/api/users/:userId/chats/last-messages', async (req, res) => {
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
          .from('Messages')
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

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
