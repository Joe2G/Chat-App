const express = require('express');
const bcrypt = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();
const supabaseUrl = 'https://ctfkjrdhhrkmztzcrwub.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

router.post('/users', async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const hashedPassword = await bcrypt.hash('userid', 10);

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

module.exports = router;
