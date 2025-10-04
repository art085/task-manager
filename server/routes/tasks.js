const express = require('express');
const { db } = require('../database/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all tasks with filtering and search
router.get('/', authMiddleware, (req, res) => {
  const { status, priority, search, sortBy = 'created_at', order = 'DESC' } = req.query;
  
  let query = 'SELECT * FROM tasks WHERE user_id = ?';
  const params = [req.userId];

  // Apply filters
  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  if (priority) {
    query += ' AND priority = ?';
    params.push(priority);
  }

  if (search) {
    query += ' AND (title LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  // Apply sorting
  const validSortFields = ['created_at', 'deadline', 'priority', 'title'];
  const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
  const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  
  query += ` ORDER BY ${sortField} ${sortOrder}`;

  db.all(query, params, (err, tasks) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    res.json({ tasks });
  });
});

// Get single task
router.get('/:id', authMiddleware, (req, res) => {
  db.get(
    'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
    [req.params.id, req.userId],
    (err, task) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      res.json({ task });
    }
  );
});

// Create task
router.post('/', authMiddleware, (req, res) => {
  const { title, description, deadline, priority, status } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  db.run(
    `INSERT INTO tasks (user_id, title, description, deadline, priority, status) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [req.userId, title, description || '', deadline || null, priority || 'medium', status || 'To Do'],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error creating task' });
      }

      db.get('SELECT * FROM tasks WHERE id = ?', [this.lastID], (err, task) => {
        if (err) {
          return res.status(500).json({ message: 'Error retrieving task' });
        }

        res.status(201).json({ message: 'Task created successfully', task });
      });
    }
  );
});

// Update task
router.put('/:id', authMiddleware, (req, res) => {
  const { title, description, deadline, priority, status } = req.body;

  db.run(
    `UPDATE tasks 
     SET title = ?, description = ?, deadline = ?, priority = ?, status = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ? AND user_id = ?`,
    [title, description, deadline, priority, status, req.params.id, req.userId],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error updating task' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Task not found' });
      }

      db.get('SELECT * FROM tasks WHERE id = ?', [req.params.id], (err, task) => {
        if (err) {
          return res.status(500).json({ message: 'Error retrieving task' });
        }

        res.json({ message: 'Task updated successfully', task });
      });
    }
  );
});

// Delete task
router.delete('/:id', authMiddleware, (req, res) => {
  db.run(
    'DELETE FROM tasks WHERE id = ? AND user_id = ?',
    [req.params.id, req.userId],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error deleting task' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Task not found' });
      }

      res.json({ message: 'Task deleted successfully' });
    }
  );
});

module.exports = router;

