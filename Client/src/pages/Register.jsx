import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'barista'
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      await api.post('/registration', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSuccess('Registration successful! Please login to continue.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="text-center mb-4">
          <i className="fas fa-coffee text-primary mb-3" style={{ fontSize: '3rem', color: 'var(--cafe-primary)' }}></i>
          <h2 className="fw-bold mb-2" style={{ color: 'var(--cafe-primary)' }}>Join Cafe QuickBrew</h2>
          <p className="text-muted">Create your account to get started</p>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success" role="alert">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label fw-medium">Username</label>
            <input
              type="text"
              className="form-control form-control-cafe"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
            />
          </div>

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

          <div className="mb-3">
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

          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label fw-medium">Confirm Password</label>
            <input
              type="password"
              className="form-control form-control-cafe"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="role" className="form-label fw-medium">Role</label>
            <select
              className="form-control form-control-cafe"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="barista">Barista</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="image" className="form-label fw-medium">Profile Image (Optional)</label>
            <input
              type="file"
              className="form-control form-control-cafe"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
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
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>

          <div className="text-center">
            <span className="text-muted">Already have an account? </span>
            <Link to="/login" className="text-decoration-none fw-medium" style={{ color: 'var(--cafe-primary)' }}>
              Sign in here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;