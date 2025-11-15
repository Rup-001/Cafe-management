import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { email, otp } = location.state || {};

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
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await api.post('/reset-password', {
        email,
        otp,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });
      
      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!email || !otp) {
    navigate('/forgot-password');
    return null;
  }

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="text-center mb-4">
          <i className="fas fa-key text-primary mb-3" style={{ fontSize: '3rem', color: 'var(--cafe-primary)' }}></i>
          <h2 className="fw-bold mb-2" style={{ color: 'var(--cafe-primary)' }}>Reset Password</h2>
          <p className="text-muted">Enter your new password below</p>
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
            <label htmlFor="newPassword" className="form-label fw-medium">New Password</label>
            <input
              type="password"
              className="form-control form-control-cafe"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              placeholder="Enter new password"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="form-label fw-medium">Confirm New Password</label>
            <input
              type="password"
              className="form-control form-control-cafe"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm new password"
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
                Resetting...
              </>
            ) : (
              'Reset Password'
            )}
          </button>

          <div className="text-center">
            <Link to="/login" className="text-decoration-none" style={{ color: 'var(--cafe-primary)' }}>
              <i className="fas fa-arrow-left me-1"></i>
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;