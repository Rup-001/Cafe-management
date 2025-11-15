import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/send-otp', { email });
      setSuccess('OTP sent to your email! Redirecting to verification page...');
      setTimeout(() => {
        navigate('/verify-otp', { state: { email } });
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="text-center mb-4">
          <i className="fas fa-lock text-primary mb-3" style={{ fontSize: '3rem', color: 'var(--cafe-primary)' }}></i>
          <h2 className="fw-bold mb-2" style={{ color: 'var(--cafe-primary)' }}>Forgot Password?</h2>
          <p className="text-muted">Don't worry! Enter your email and we'll send you a reset code.</p>
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
          <div className="mb-4">
            <label htmlFor="email" className="form-label fw-medium">Email Address</label>
            <input
              type="email"
              className="form-control form-control-cafe"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email address"
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
                Sending OTP...
              </>
            ) : (
              'Send Reset Code'
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

export default ForgotPassword;