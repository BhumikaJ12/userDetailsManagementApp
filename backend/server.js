const express = require('express');
const cors = require('cors');
const pool = require('./database'); // Import the database connection
require('dotenv').config();

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON

// API route to get all users
app.get('/api/users', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users');
    console.log("Fetched users:", rows);
    res.json(rows); 
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).send('Server error while fetching users');
  }
});

// API route to create a new user
app.post('/api/users', async (req, res) => {
  const { firstName, lastName, phoneNumber, email, address } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (existingUser.rows.length > 0) {
      // If user already exists, return a specific error message
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Proceed to create the new user if the email is unique
    const newUser = await pool.query(
      'INSERT INTO users (first_name, last_name, phone_number, email, address) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [firstName, lastName, phoneNumber, email, address]
    );

    // Send back the newly created user details
    res.status(201).json(newUser.rows[0]);

  } catch (err) {
    console.error('Error creating new user:', err.message);
    res.status(500).send('Server error while creating new user');
  }
});

// API route to update a user
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, phoneNumber, email, address } = req.body;

  try {
    const updatedUser = await pool.query(
      'UPDATE users SET first_name = $1, last_name = $2, phone_number = $3, email = $4, address = $5 WHERE id = $6 RETURNING *',
      [firstName, lastName, phoneNumber, email, address, id]
    );

    if (updatedUser.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser.rows[0]);

  } catch (err) {
    console.error('Error updating user:', err.message);
    res.status(500).send('Server error while updating user');
  }
});

// API route to delete a user
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(204).send(); // No content response

  } catch (err) {
    console.error('Error deleting user:', err.message);
    res.status(500).send('Server error while deleting user');
  }
});

// Start your server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
