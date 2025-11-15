import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Login = ({ setUser, user }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      console.log('User state updated:', user); // Debug user state
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/login', formData);
      console.log('API Response:', response.data);
      const { token, username, role } = response.data;

      // Construct a user object to match expected structure
      const userData = { username, role, email: formData.email };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="text-center mb-4">
          <i className="fas fa-coffee text-primary mb-3" style={{ fontSize: '3rem', color: 'var(--cafe-primary)' }}></i>
          <h2 className="fw-bold mb-2" style={{ color: 'var(--cafe-primary)' }}>Welcome Back</h2>
          <p className="text-muted">Sign in to your Cafe QuickBrew account</p>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-medium">Email Address</label>
            <input
              type="email"
              className="form-control form-control-cafe"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="form-label fw-medium">Password</label>
            <input
              type="password"
              className="form-control form-control-cafe"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-cafe-primary w-100 mb-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner me-2"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          <div className="text-center">
            <Link to="/forgot-password" className="text-decoration-none" style={{ color: 'var(--cafe-primary)' }}>
              Forgot your password?
            </Link>
          </div>

          <hr className="my-4" />

          <div className="text-center">
            <span className="text-muted">Don't have an account? </span>
            <Link to="/register" className="text-decoration-none fw-medium" style={{ color: 'var(--cafe-primary)' }}>
              Sign up here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;