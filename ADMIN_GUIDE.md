# Admin Feature Guide

## Overview
The Task Manager application now includes comprehensive admin functionality that allows administrators to monitor all users and their tasks.

## Default Admin Account
A default admin account is automatically created when the server starts for the first time:

**Login Credentials:**
- **Email:** admin@taskmanager.com
- **Username:** admin
- **Password:** admin123

⚠️ **Important:** Change the default admin password in production!

## Admin Features

### 1. Admin Panel Overview
The admin panel provides three main tabs:

#### Overview Tab
- **Total Users:** Count of all registered users
- **Total Tasks:** Count of all tasks in the system
- **Completed Tasks:** Number of completed tasks
- **New Users (7d):** Users registered in the last 7 days
- **Tasks by Status:** Visual breakdown of tasks by status (To Do, In Progress, Completed)
- **Tasks by Priority:** Visual breakdown of tasks by priority (Low, Medium, High)

#### Users Tab
- View all registered users
- See user details including:
  - Username and email
  - Admin status badge
  - User ID
  - Registration date
- Click on any user to view their specific tasks
- View detailed task information for each user including:
  - Task title and description
  - Priority level
  - Status
  - Deadlines

#### All Tasks Tab
- View all tasks from all users in one place
- See which user created each task
- Filter and monitor tasks across the entire system
- View task details including priority, status, and deadlines

### 2. Admin Navigation
- Admin users will see an "Admin" link in the navigation bar
- Regular users will not see this link
- The admin panel is only accessible to users with admin privileges

### 3. Security
- Admin routes are protected by middleware
- Only users with `is_admin = 1` in the database can access admin endpoints
- JWT tokens include admin status for verification
- Non-admin users receive a 403 Forbidden error if they try to access admin routes

## Technical Details

### Backend Changes

#### Database Schema
Added `is_admin` column to users table:
```sql
is_admin INTEGER DEFAULT 0
```

#### New API Endpoints
All admin endpoints require admin authentication:

- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:userId` - Get specific user with their tasks
- `GET /api/admin/tasks` - Get all tasks from all users
- `GET /api/admin/stats` - Get system-wide statistics

#### New Middleware
- `adminAuth.js` - Validates admin privileges before allowing access

### Frontend Changes

#### New Components
- `Admin.jsx` - Complete admin dashboard with tabs for overview, users, and tasks

#### Updated Components
- `Layout.jsx` - Shows admin link only for admin users
- `App.jsx` - Added admin route
- `api.js` - Added admin API endpoints

## Creating Additional Admin Users

To make an existing user an admin:

1. Access the SQLite database:
   ```bash
   sqlite3 server/database/taskmanager.db
   ```

2. Update the user:
   ```sql
   UPDATE users SET is_admin = 1 WHERE email = 'user@example.com';
   ```

3. The user will need to log out and log back in to see the admin features.

Alternatively, you can create a new admin user directly:
```sql
INSERT INTO users (username, email, password, is_admin) 
VALUES ('newadmin', 'newadmin@example.com', 'hashed_password', 1);
```

## Best Practices

1. **Change Default Password:** Always change the default admin password in production
2. **Limit Admin Access:** Only grant admin privileges to trusted users
3. **Monitor Admin Activity:** Keep track of who has admin access
4. **Regular Audits:** Periodically review user accounts and their admin status

## Troubleshooting

### Admin Link Not Showing
- Ensure you're logged in with an admin account
- Check that the user object in localStorage has `isAdmin: true`
- Try logging out and back in

### Access Denied Errors
- Verify the user has `is_admin = 1` in the database
- Check that the JWT token includes the admin flag
- Ensure the server has been restarted after database changes

### Database Issues
If the admin column doesn't exist in an older database:
```sql
ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0;
```

## Security Considerations

1. **Token Security:** Admin status is embedded in JWT tokens
2. **Server-Side Validation:** All admin endpoints verify admin status in the database
3. **Frontend Protection:** Admin links are hidden from non-admin users
4. **Backend Protection:** Admin routes are protected by middleware

---

For more information, see the main README.md and SETUP_GUIDE.md files.

