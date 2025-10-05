const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'taskmanager.db');
const db = new sqlite3.Database(dbPath);

const initDatabase = () => {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        is_admin INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add is_admin column if it doesn't exist (for existing databases)
    db.run(`
      ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0
    `, (err) => {
      if (err && !err.message.includes('duplicate column')) {
        console.error('Error adding is_admin column:', err);
      }
    });

    // Tasks table
    db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        deadline DATETIME,
        priority TEXT CHECK(priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
        status TEXT CHECK(status IN ('To Do', 'In Progress', 'Completed')) DEFAULT 'To Do',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create default admin account (username: admin, password: admin123)
    db.get('SELECT * FROM users WHERE username = ?', ['admin'], async (err, user) => {
      if (!user) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        db.run(
          'INSERT INTO users (username, email, password, is_admin) VALUES (?, ?, ?, ?)',
          ['admin', 'admin@taskmanager.com', hashedPassword, 1],
          (err) => {
            if (err) {
              console.error('Error creating admin user:', err);
            } else {
              console.log('Default admin account created (username: admin, password: admin123)');
            }
          }
        );
      }
    });

    console.log('Database initialized successfully');
  });
};

module.exports = { db, initDatabase };

