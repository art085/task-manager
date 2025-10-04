# Task Manager Application

A comprehensive full-stack task management application built with React and Node.js. This application allows users to create, manage, and track their personal tasks with detailed analytics and filtering capabilities.

## Features

### User Management
- User registration and authentication
- Secure JWT-based authentication
- User profile management

### Task Management
- Create tasks with title, description, deadline, and priority
- Three status levels: "To Do", "In Progress", "Completed"
- Three priority levels: Low, Medium, High
- Edit and delete tasks
- Real-time task updates

### Filtering and Search
- Search tasks by title or description
- Filter by status (To Do, In Progress, Completed)
- Filter by priority (Low, Medium, High)
- Sort tasks by various criteria

### Analytics Dashboard
- Total task count
- Completed task statistics
- Active tasks (To Do + In Progress)
- Overdue task tracking
- Status breakdown with visual charts
- Priority distribution
- Completion rate calculation
- Recent task overview

## Tech Stack

### Backend
- **Node.js** with Express.js
- **SQLite** database for data persistence
- **JWT** for authentication
- **bcryptjs** for password hashing

### Frontend
- **React 18** with hooks
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Vite** as build tool
- **date-fns** for date formatting

## Project Structure

```
task-manager/
├── server/                 # Backend Node.js application
│   ├── database/          # Database setup and connection
│   │   └── db.js         # SQLite database initialization
│   ├── middleware/        # Express middleware
│   │   └── auth.js       # JWT authentication middleware
│   ├── routes/           # API routes
│   │   ├── auth.js       # Authentication endpoints
│   │   ├── tasks.js      # Task CRUD endpoints
│   │   └── analytics.js  # Analytics endpoints
│   └── index.js          # Server entry point
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/   # Reusable React components
│   │   │   ├── Layout.jsx
│   │   │   └── TaskModal.jsx
│   │   ├── pages/        # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Tasks.jsx
│   │   │   └── Analytics.jsx
│   │   ├── utils/        # Utility functions
│   │   │   └── api.js    # API client
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point
│   └── index.html
├── package.json          # Backend dependencies
└── README.md
```

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation Steps

1. **Clone or navigate to the project directory**
   ```bash
   cd task-manager
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Configure environment variables**
   
   The `.env` file is already created with default values. For production, update:
   - `JWT_SECRET`: Change to a secure random string
   - `PORT`: Change if needed (default: 5000)

### Running the Application

#### Option 1: Run backend and frontend separately

**Terminal 1 - Backend:**
```bash
npm run server
```
The backend will run on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
npm run client
```
The frontend will run on `http://localhost:3000`

#### Option 2: Run both concurrently
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Tasks
- `GET /api/tasks` - Get all tasks with filters
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Analytics
- `GET /api/analytics/stats` - Get task statistics

## Usage

1. **Register/Login**
   - Navigate to the login page
   - Create a new account or login with existing credentials

2. **Dashboard**
   - View overview statistics
   - See recent tasks
   - Quick access to all features

3. **Tasks Page**
   - Create new tasks using the "New Task" button
   - Filter tasks by status, priority, or search
   - Edit or delete existing tasks
   - View all task details

4. **Analytics Page**
   - View comprehensive task statistics
   - See status and priority breakdowns
   - Track completion rates
   - Monitor overdue tasks

## Database Schema

### Users Table
- `id` - Primary key
- `username` - Unique username
- `email` - Unique email address
- `password` - Hashed password
- `created_at` - Registration timestamp

### Tasks Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `title` - Task title
- `description` - Task description
- `deadline` - Task deadline
- `priority` - Task priority (low, medium, high)
- `status` - Task status (To Do, In Progress, Completed)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected API routes
- CORS enabled
- SQL injection prevention through parameterized queries

## Future Enhancements

Potential features for future versions:
- Task categories/tags
- Task sharing and collaboration
- Email notifications
- Task attachments
- Recurring tasks
- Mobile responsive improvements
- Dark mode
- Export tasks to CSV/PDF

## Contributing

This is a demonstration project. Feel free to fork and customize it for your needs.

## License

ISC

## Support

For issues or questions, please create an issue in the project repository.

---

**Developed with ❤️ using React and Node.js**

