import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const ShowUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/AllUser');
      setUsers(response.data);
    } catch (error) {
      setError('Error fetching users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${userId}`);
        setUsers(users.filter(user => user._id !== userId));
        alert('User deleted successfully!');
      } catch (error) {
        alert('Error deleting user: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 style={{ color: 'var(--cafe-primary)' }}>
              <i className="fas fa-users me-2"></i>
              All Users
            </h2>
            <Link to="/add-user" className="btn btn-cafe-primary">
              <i className="fas fa-plus me-2"></i>
              Add New User
            </Link>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          {users.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-users" style={{ fontSize: '4rem', color: 'var(--cafe-secondary)' }}></i>
              <h4 className="mt-3" style={{ color: 'var(--cafe-primary)' }}>No Users Found</h4>
              <p className="text-muted">Get started by adding your first user.</p>
              <Link to="/add-user" className="btn btn-cafe-primary">
                <i className="fas fa-plus me-2"></i>
                Add User
              </Link>
            </div>
          ) : (
            <div className="row">
              {users.map((user) => (
                <div key={user._id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body text-center">
                      <div className="mb-3">
                        {user.image ? (
                          <img 
                            src={user.image} 
                            alt={user.username}
                            className="rounded-circle"
                            style={{ 
                              width: '80px', 
                              height: '80px', 
                              objectFit: 'cover',
                              border: '3px solid var(--cafe-primary)'
                            }}
                          />
                        ) : (
                          <i 
                            className="fas fa-user-circle" 
                            style={{ 
                              fontSize: '5rem', 
                              color: 'var(--cafe-secondary)' 
                            }}
                          ></i>
                        )}
                      </div>
                      
                      <h5 className="card-title" style={{ color: 'var(--cafe-primary)' }}>
                        {user.username}
                      </h5>
                      
                      <p className="card-text">
                        <i className="fas fa-envelope me-2"></i>
                        {user.email}
                      </p>
                      
                      <p className="card-text">
                        <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>
                          <i className="fas fa-user-tag me-1"></i>
                          {user.role}
                        </span>
                      </p>

                      <div className="d-flex justify-content-center gap-2 mt-3">
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowUsers;