import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Analytics from './pages/Analytics';
import Admin from './pages/Admin';
import Layout from './components/Layout';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login setAuth={setIsAuthenticated} /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <Register setAuth={setIsAuthenticated} /> : <Navigate to="/dashboard" />} />
        
        <Route element={isAuthenticated ? <Layout setAuth={setIsAuthenticated} /> : <Navigate to="/login" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/admin" element={<Admin />} />
        </Route>

        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;

