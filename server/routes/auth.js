const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../database/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists
    db.get('SELECT * FROM users WHERE email = ? OR username = ?', [email, username], async (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      db.run(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword],
        function(err) {
          if (err) {
            return res.status(500).json({ message: 'Error creating user' });
          }

          const token = jwt.sign(
            { userId: this.lastID },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
          );

          res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { id: this.lastID, username, email, isAdmin: false }
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user.id, isAdmin: user.is_admin },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      res.json({
        message: 'Login successful',
        token,
        user: { id: user.id, username: user.username, email: user.email, isAdmin: Boolean(user.is_admin) }
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get profile
router.get('/profile', authMiddleware, (req, res) => {
  db.get('SELECT id, username, email, is_admin, created_at FROM users WHERE id = ?', [req.userId], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: { ...user, isAdmin: Boolean(user.is_admin) } });
  });
});

module.exports = router;

