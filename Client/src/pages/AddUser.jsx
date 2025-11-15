import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AddUser = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      // Create user
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };

      const response = await api.post('/users', userData);
      const userId = response.data.user._id;

      // Upload image if provided
      if (image) {
        const imageFormData = new FormData();
        imageFormData.append('image', image);
        await api.post(`/users/${userId}/upload-photo`, imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      alert('User created successfully!');
      navigate('/show-users');
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-header text-center" style={{ backgroundColor: 'var(--cafe-primary)', color: 'white' }}>
              <h3 className="mb-0">
                <i className="fas fa-user-plus me-2"></i>
                Add New User
              </h3>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    <i className="fas fa-user me-2"></i>Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    <i className="fas fa-envelope me-2"></i>Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    <i className="fas fa-lock me-2"></i>Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    <i className="fas fa-lock me-2"></i>Confirm Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="role" className="form-label">
                    <i className="fas fa-user-tag me-2"></i>Role
                  </label>
                  <select
                    className="form-select"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="image" className="form-label">
                    <i className="fas fa-image me-2"></i>Profile Photo
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <div className="form-text">Optional. Supported formats: JPG, PNG, GIF</div>
                </div>

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-cafe-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Creating User...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-plus me-2"></i>
                        Create User
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/show-users')}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Back to Users
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;