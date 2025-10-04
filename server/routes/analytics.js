const express = require('express');
const { db } = require('../database/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get statistics
router.get('/stats', authMiddleware, (req, res) => {
  const userId = req.userId;

  const queries = {
    total: 'SELECT COUNT(*) as count FROM tasks WHERE user_id = ?',
    completed: 'SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status = "Completed"',
    inProgress: 'SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status = "In Progress"',
    toDo: 'SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status = "To Do"',
    overdue: `SELECT COUNT(*) as count FROM tasks 
               WHERE user_id = ? AND status != "Completed" 
               AND deadline < datetime('now') AND deadline IS NOT NULL`,
    byPriority: 'SELECT priority, COUNT(*) as count FROM tasks WHERE user_id = ? GROUP BY priority',
    recentTasks: 'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC LIMIT 5'
  };

  const stats = {};

  // Execute all queries
  db.get(queries.total, [userId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    stats.total = result.count;

    db.get(queries.completed, [userId], (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      stats.completed = result.count;

      db.get(queries.inProgress, [userId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        stats.inProgress = result.count;

        db.get(queries.toDo, [userId], (err, result) => {
          if (err) return res.status(500).json({ message: 'Database error' });
          stats.toDo = result.count;

          db.get(queries.overdue, [userId], (err, result) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            stats.overdue = result.count;

            db.all(queries.byPriority, [userId], (err, results) => {
              if (err) return res.status(500).json({ message: 'Database error' });
              
              stats.byPriority = {
                low: 0,
                medium: 0,
                high: 0
              };

              results.forEach(row => {
                stats.byPriority[row.priority] = row.count;
              });

              db.all(queries.recentTasks, [userId], (err, tasks) => {
                if (err) return res.status(500).json({ message: 'Database error' });
                stats.recentTasks = tasks;

                res.json({ stats });
              });
            });
          });
        });
      });
    });
  });
});

module.exports = router;

