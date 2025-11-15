import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOtp from './pages/VerifyOtp';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Menu from './pages/Menu';
import Order from './pages/Order';
import Invoice from './pages/Invoice';
import Report from './pages/Report';
import AddItem from './pages/AddItem';
import ShowItems from './pages/ShowItems';
import AddInventory from './pages/AddInventory';
import ShowInventory from './pages/ShowInventory';
import AddUser from './pages/AddUser';
import ShowUsers from './pages/ShowUsers';
import Navbar from './pages/Navbar';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData && userData !== 'undefined') {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="loading-spinner"></div>
        </div>
      );
    }
    
    return user ? children : <Navigate to="/login" />;
  };

  const AdminRoute = ({ children }) => {
    if (loading) {
      return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="loading-spinner"></div>
        </div>
      );
    }
    
    return user && user.role === 'admin' ? children : <Navigate to="/dashboard" />;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {user && <Navbar user={user} setUser={setUser} />}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/dashboard" />} />
        <Route path="/verify-otp" element={!user ? <VerifyOtp /> : <Navigate to="/dashboard" />} />
        <Route path="/reset-password" element={!user ? <ResetPassword /> : <Navigate to="/dashboard" />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
        <Route path="/order" element={<ProtectedRoute><Order /></ProtectedRoute>} />
        <Route path="/invoice/:id" element={<ProtectedRoute><Invoice /></ProtectedRoute>} />
        <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
        
        {/* Admin Routes */}
        <Route path="/add-item" element={<AdminRoute><AddItem /></AdminRoute>} />
        <Route path="/show-items" element={<AdminRoute><ShowItems /></AdminRoute>} />
        <Route path="/add-inventory" element={<AdminRoute><AddInventory /></AdminRoute>} />
        <Route path="/show-inventory" element={<AdminRoute><ShowInventory /></AdminRoute>} />
        <Route path="/add-user" element={<AdminRoute><AddUser /></AdminRoute>} />
        <Route path="/show-users" element={<AdminRoute><ShowUsers /></AdminRoute>} />
        
        {/* Default Route */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;