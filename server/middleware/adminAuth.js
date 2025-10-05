const jwt = require('jsonwebtoken');
const { db } = require('../database/db');

const adminAuthMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;

    // Check if user is admin
    db.get('SELECT is_admin FROM users WHERE id = ?', [req.userId], (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (!user || !user.is_admin) {
        return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
      }

      next();
    });
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = adminAuthMiddleware;

