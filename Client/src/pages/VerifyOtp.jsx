import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/verify-otp', { email, otp });
      setSuccess('OTP verified successfully! Redirecting to reset password...');
      setTimeout(() => {
        navigate('/reset-password', { state: { email, otp } });
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    navigate('/forgot-password');
    return null;
  }

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="text-center mb-4">
          <i className="fas fa-shield-alt text-primary mb-3" style={{ fontSize: '3rem', color: 'var(--cafe-primary)' }}></i>
          <h2 className="fw-bold mb-2" style={{ color: 'var(--cafe-primary)' }}>Verify OTP</h2>
          <p className="text-muted">
            We've sent a verification code to <strong>{email}</strong>
          </p>
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
            <label htmlFor="otp" className="form-label fw-medium">Verification Code</label>
            <input
              type="text"
              className="form-control form-control-cafe text-center"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              placeholder="Enter 6-digit code"
              maxLength="6"
              style={{ fontSize: '1.5rem', letterSpacing: '0.5rem' }}
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
                Verifying...
              </>
            ) : (
              'Verify Code'
            )}
          </button>

          <div className="text-center">
            <Link to="/forgot-password" className="text-decoration-none" style={{ color: 'var(--cafe-primary)' }}>
              <i className="fas fa-arrow-left me-1"></i>
              Back to Email Entry
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;