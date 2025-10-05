const express = require('express');
const { db } = require('../database/db');
const adminAuthMiddleware = require('../middleware/adminAuth');

const router = express.Router();

// Get all users (admin only)
router.get('/users', adminAuthMiddleware, (req, res) => {
  db.all(
    'SELECT id, username, email, is_admin, created_at FROM users ORDER BY created_at DESC',
    [],
    (err, users) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      // Convert is_admin to boolean
      const usersWithBool = users.map(user => ({
        ...user,
        isAdmin: Boolean(user.is_admin)
      }));

      res.json({ users: usersWithBool });
    }
  );
});

// Get specific user details with their tasks (admin only)
router.get('/users/:userId', adminAuthMiddleware, (req, res) => {
  const { userId } = req.params;

  db.get(
    'SELECT id, username, email, is_admin, created_at FROM users WHERE id = ?',
    [userId],
    (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Get user's tasks
      db.all(
        'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
        [userId],
        (err, tasks) => {
          if (err) {
            return res.status(500).json({ message: 'Database error' });
          }

          res.json({
            user: { ...user, isAdmin: Boolean(user.is_admin) },
            tasks
          });
        }
      );
    }
  );
});

// Get all tasks from all users (admin only)
router.get('/tasks', adminAuthMiddleware, (req, res) => {
  const query = `
    SELECT 
      tasks.*, 
      users.username, 
      users.email 
    FROM tasks 
    JOIN users ON tasks.user_id = users.id 
    ORDER BY tasks.created_at DESC
  `;

  db.all(query, [], (err, tasks) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    res.json({ tasks });
  });
});

// Get admin statistics (admin only)
router.get('/stats', adminAuthMiddleware, (req, res) => {
  const stats = {};

  // Get total users count
  db.get('SELECT COUNT(*) as count FROM users', [], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    stats.totalUsers = result.count;

    // Get total tasks count
    db.get('SELECT COUNT(*) as count FROM tasks', [], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      stats.totalTasks = result.count;

      // Get tasks by status
      db.all(
        'SELECT status, COUNT(*) as count FROM tasks GROUP BY status',
        [],
        (err, statusCounts) => {
          if (err) {
            return res.status(500).json({ message: 'Database error' });
          }
          
          stats.tasksByStatus = statusCounts.reduce((acc, row) => {
            acc[row.status] = row.count;
            return acc;
          }, {});

          // Get tasks by priority
          db.all(
            'SELECT priority, COUNT(*) as count FROM tasks GROUP BY priority',
            [],
            (err, priorityCounts) => {
              if (err) {
                return res.status(500).json({ message: 'Database error' });
              }
              
              stats.tasksByPriority = priorityCounts.reduce((acc, row) => {
                acc[row.priority] = row.count;
                return acc;
              }, {});

              // Get recent registrations (last 7 days)
              db.get(
                `SELECT COUNT(*) as count FROM users 
                 WHERE created_at >= datetime('now', '-7 days')`,
                [],
                (err, result) => {
                  if (err) {
                    return res.status(500).json({ message: 'Database error' });
                  }
                  stats.recentRegistrations = result.count;

                  res.json(stats);
                }
              );
            }
          );
        }
      );
    });
  });
});

module.exports = router;

