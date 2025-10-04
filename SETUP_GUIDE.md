# Quick Setup Guide

Follow these steps to get the Task Manager application running:

## Step 1: Install Dependencies

Open your terminal in the project root directory and run:

```bash
npm install
```

Then install the client dependencies:

```bash
cd client
npm install
cd ..
```

## Step 2: Start the Application

You have two options:

### Option A: Run Both Backend and Frontend Together (Recommended)
```bash
npm run dev
```

### Option B: Run Separately in Two Terminals

**Terminal 1 (Backend):**
```bash
npm run server
```

**Terminal 2 (Frontend):**
```bash
npm run client
```

## Step 3: Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## Step 4: Create Your First Account

1. Click on "Sign up" or "Register"
2. Fill in:
   - Username (e.g., "john_doe")
   - Email (e.g., "john@example.com")
   - Password (e.g., "password123")
3. Click "Sign up"

You'll be automatically logged in and redirected to the dashboard!

## Step 5: Create Your First Task

1. Navigate to the "Tasks" page from the top menu
2. Click the "New Task" button
3. Fill in the task details:
   - Title: e.g., "Complete project proposal"
   - Description: e.g., "Draft and review the Q4 project proposal"
   - Deadline: Select a date
   - Priority: Choose Low, Medium, or High
   - Status: Select "To Do", "In Progress", or "Completed"
4. Click "Create"

## Features to Explore

### Dashboard
- View quick statistics about your tasks
- See recent tasks at a glance
- Quick overview of completed, overdue, and active tasks

### Tasks Page
- Create, edit, and delete tasks
- Use filters to find specific tasks:
  - Search by title or description
  - Filter by status (To Do, In Progress, Completed)
  - Filter by priority (Low, Medium, High)

### Analytics Page
- View detailed statistics:
  - Total tasks count
  - Completion rate
  - Status breakdown with visual charts
  - Priority distribution
  - Overdue tasks tracking

## Troubleshooting

### Port Already in Use
If you get an error that port 5000 or 3000 is already in use:
- Change the backend port in `.env` file (change PORT=5000 to another port)
- Change the frontend port in `client/vite.config.js`

### Database Issues
The SQLite database is automatically created when you first run the server. If you encounter database issues:
- Stop the server
- Delete the `server/database/taskmanager.db` file
- Restart the server (the database will be recreated)

### Dependencies Issues
If you encounter dependency errors:
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install

# Do the same for client
cd client
rm -rf node_modules
npm install
cd ..
```

## Default Configuration

- Backend runs on: `http://localhost:5000`
- Frontend runs on: `http://localhost:3000`
- Database: SQLite (stored in `server/database/taskmanager.db`)
- Authentication: JWT tokens (stored in browser localStorage)

## Need Help?

Check the main README.md file for more detailed information about:
- API endpoints
- Project structure
- Database schema
- Security features

---

Happy task managing! 🚀

