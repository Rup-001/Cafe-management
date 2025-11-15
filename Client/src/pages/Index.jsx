import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="auth-container">
      <div className="text-center">
        <div className="loading-spinner"></div>
        <p className="mt-2">Redirecting...</p>
      </div>
    </div>
  );
};

export default Index;