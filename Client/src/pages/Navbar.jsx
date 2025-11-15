import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, setUser }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-cafe">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/dashboard">
          <i className="fas fa-coffee me-2" style={{ fontSize: '1.5rem', color: 'var(--cafe-primary)' }}></i>
          <span className="fw-bold" style={{ color: 'var(--cafe-primary)' }}>Cafe QuickBrew</span>
        </Link>

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">
                <i className="fas fa-tachometer-alt me-1"></i>
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/menu">
                <i className="fas fa-utensils me-1"></i>
                Menu
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/order">
                <i className="fas fa-shopping-cart me-1"></i>
                Order
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/report">
                <i className="fas fa-chart-bar me-1"></i>
                Report
              </Link>
            </li>
            
            {user && user.role === 'admin' && (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  <i className="fas fa-cog me-1"></i>
                  Admin
                </a>
                <ul className="dropdown-menu">
                  <li><h6 className="dropdown-header">Items</h6></li>
                  <li><Link className="dropdown-item" to="/add-item">Add Item</Link></li>
                  <li><Link className="dropdown-item" to="/show-items">Show Items</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><h6 className="dropdown-header">Inventory</h6></li>
                  <li><Link className="dropdown-item" to="/add-inventory">Add Inventory</Link></li>
                  <li><Link className="dropdown-item" to="/show-inventory">Show Inventory</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><h6 className="dropdown-header">Users</h6></li>
                  <li><Link className="dropdown-item" to="/add-user">Add User</Link></li>
                  <li><Link className="dropdown-item" to="/show-users">Show Users</Link></li>
                </ul>
              </li>
            )}
          </ul>

          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle d-flex align-items-center" 
                href="#" 
                role="button" 
                onClick={toggleDropdown}
                style={{ cursor: 'pointer' }}
              >
                {user.image ? (
                  <img 
                    src={user.image} 
                    alt="Profile" 
                    className="rounded-circle me-2"
                    style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                  />
                ) : (
                  <i className="fas fa-user-circle me-2" style={{ fontSize: '1.5rem' }}></i>
                )}
                {user.username}
              </a>
              {showDropdown && (
                <ul className="dropdown-menu dropdown-menu-end show">
                  <li>
                    <span className="dropdown-item-text">
                      <strong>{user.username}</strong><br />
                      <small className="text-muted">{user.email}</small><br />
                      <small className="badge bg-secondary">{user.role}</small>
                    </span>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;