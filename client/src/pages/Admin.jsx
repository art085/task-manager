import { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';

function Admin() {
  const [users, setUsers] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [usersRes, tasksRes, statsRes] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getAllTasks(),
        adminAPI.getAdminStats(),
      ]);
      setUsers(usersRes.data.users);
      setAllTasks(tasksRes.data.tasks);
      setStats(statsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const response = await adminAPI.getUserDetails(userId);
      setUserDetails(response.data);
      setSelectedUser(userId);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load user details');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'In Progress': return 'text-blue-600 bg-blue-100';
      case 'To Do': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-600 mt-1">Manage users and monitor all tasks</p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`${
              activeTab === 'overview'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`${
              activeTab === 'users'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`${
              activeTab === 'tasks'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            All Tasks
          </button>
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                      <dd className="text-lg font-semibold text-gray-900">{stats.totalUsers || 0}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Tasks</dt>
                      <dd className="text-lg font-semibold text-gray-900">{stats.totalTasks || 0}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Completed Tasks</dt>
                      <dd className="text-lg font-semibold text-gray-900">{stats.tasksByStatus?.Completed || 0}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">New Users (7d)</dt>
                      <dd className="text-lg font-semibold text-gray-900">{stats.recentRegistrations || 0}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status & Priority Distribution */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tasks by Status</h3>
              <div className="space-y-3">
                {Object.entries(stats.tasksByStatus || {}).map(([status, count]) => (
                  <div key={status} className="flex justify-between items-center">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
                      {status}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tasks by Priority</h3>
              <div className="space-y-3">
                {Object.entries(stats.tasksByPriority || {}).map(([priority, count]) => (
                  <div key={priority} className="flex justify-between items-center">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getPriorityColor(priority)}`}>
                      {priority}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {users.map((user) => (
                <li key={user.id}>
                  <button
                    onClick={() => fetchUserDetails(user.id)}
                    className="block hover:bg-gray-50 w-full text-left"
                  >
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-indigo-600 truncate">
                            {user.username}
                          </p>
                          {user.isAdmin && (
                            <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                              Admin
                            </span>
                          )}
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="text-xs text-gray-500">
                            User ID: {user.id}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-xs text-gray-500 sm:mt-0">
                          <p>
                            Joined: {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* User Details Modal */}
          {userDetails && (
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {userDetails.user.username}'s Tasks
                  </h3>
                  <p className="text-sm text-gray-500">{userDetails.user.email}</p>
                </div>
                <button
                  onClick={() => setUserDetails(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {userDetails.tasks.length === 0 ? (
                <p className="text-gray-500">No tasks yet</p>
              ) : (
                <div className="space-y-3">
                  {userDetails.tasks.map((task) => (
                    <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                          {task.description && (
                            <p className="text-xs text-gray-500 mt-1">{task.description}</p>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                        </div>
                      </div>
                      {task.deadline && (
                        <p className="text-xs text-gray-500 mt-2">
                          Deadline: {new Date(task.deadline).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* All Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {allTasks.map((task) => (
              <li key={task.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      By: {task.username} ({task.email})
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                </div>
                {task.description && (
                  <p className="text-xs text-gray-500 mt-2">{task.description}</p>
                )}
                {task.deadline && (
                  <p className="text-xs text-gray-500 mt-1">
                    Deadline: {new Date(task.deadline).toLocaleDateString()}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Admin;

