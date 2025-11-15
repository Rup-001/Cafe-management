import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Dashboard = () => {
  const [selectedOrderType, setSelectedOrderType] = useState('');
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedBarista, setSelectedBarista] = useState(null);
  const [baristas, setBaristas] = useState([]);
  const [showBaristaSelection, setShowBaristaSelection] = useState(false);
  const navigate = useNavigate();

  const handleOrderTypeSelect = (type) => {
    setSelectedOrderType(type);
    if (type === 'takeout') {
      // Go directly to menu for takeout
      navigate('/menu', { state: { orderType: 'takeout' } });
    } else if (type === 'dine-in') {
      // Show table selection for dine-in
      setSelectedTable(null);
    }
  };

  const handleTableSelect = (tableNo) => {
    setSelectedTable(tableNo);
    setShowBaristaSelection(true);
    fetchBaristas();
  };

  const handleBaristaSelect = (baristaId) => {
    setSelectedBarista(baristaId);
    navigate('/menu', { 
      state: { 
        orderType: 'dine-in', 
        tableNo: selectedTable, 
        baristaId: baristaId 
      } 
    });
  };

  const fetchBaristas = async () => {
    try {
      const response = await api.get('/AllUser');
      setBaristas(response.data);
    } catch (error) {
      console.error('Error fetching baristas:', error);
    }
  };

  const renderTableSelection = () => {
    const tables = Array.from({ length: 10 }, (_, i) => i + 1);
    
    return (
      <div className="row">
        <div className="col-12">
          <div className="dashboard-card">
            <h4 className="mb-4" style={{ color: 'var(--cafe-primary)' }}>
              <i className="fas fa-chair me-2"></i>
              Select a Table
            </h4>
            <div className="row justify-content-center">
              {tables.map((tableNo) => (
                <div key={tableNo} className="col-auto">
                  <button
                    className="btn btn-cafe-secondary table-btn"
                    onClick={() => handleTableSelect(tableNo)}
                  >
                    {tableNo}
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <button
                className="btn btn-outline-secondary"
                onClick={() => {
                  setSelectedOrderType('');
                  setSelectedTable(null);
                  setShowBaristaSelection(false);
                }}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBaristaSelection = () => {
    return (
      <div className="row">
        <div className="col-12">
          <div className="dashboard-card">
            <h4 className="mb-4" style={{ color: 'var(--cafe-primary)' }}>
              <i className="fas fa-user-tie me-2"></i>
              Select Barista for Table {selectedTable}
            </h4>
            <div className="row justify-content-center">
              {baristas.map((barista) => (
                <div key={barista._id} className="col-md-4 col-sm-6 mb-3">
                  <button
                    className="btn btn-cafe-secondary w-100 p-3"
                    onClick={() => handleBaristaSelect(barista._id)}
                  >
                    <div className="text-center">
                      {barista.image ? (
                        <img 
                          src={barista.image} 
                          alt={barista.username}
                          className="rounded-circle mb-2"
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                      ) : (
                        <i className="fas fa-user-circle mb-2" style={{ fontSize: '3rem' }}></i>
                      )}
                      <div className="fw-bold">{barista.username}</div>
                      <small className="text-muted">{barista.role}</small>
                    </div>
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <button
                className="btn btn-outline-secondary"
                onClick={() => {
                  setShowBaristaSelection(false);
                  setSelectedTable(null);
                }}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Back to Tables
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold mb-3" style={{ color: 'var(--cafe-primary)' }}>
              <i className="fas fa-coffee me-3"></i>
              Welcome to Cafe QuickBrew
            </h1>
            <p className="lead text-muted">Your favorite coffee shop management system</p>
          </div>
        </div>
      </div>

      {showBaristaSelection ? (
        renderBaristaSelection()
      ) : selectedOrderType === 'dine-in' ? (
        renderTableSelection()
      ) : (
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5 mb-4">
            <div 
              className="dashboard-card h-100"
              style={{ cursor: 'pointer' }}
              onClick={() => handleOrderTypeSelect('dine-in')}
            >
              <div className="text-center">
                <i 
                  className="fas fa-utensils mb-3" 
                  style={{ fontSize: '4rem', color: 'var(--cafe-primary)' }}
                ></i>
                <h3 className="fw-bold mb-3" style={{ color: 'var(--cafe-primary)' }}>
                  Dine In
                </h3>
                <p className="text-muted mb-4">
                  For customers dining inside the cafe. Select a table and take their order.
                </p>
                <button className="btn btn-cafe-primary px-4 py-2">
                  Start Dine In Order
                  <i className="fas fa-arrow-right ms-2"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-5 mb-4">
            <div 
              className="dashboard-card h-100"
              style={{ cursor: 'pointer' }}
              onClick={() => handleOrderTypeSelect('takeout')}
            >
              <div className="text-center">
                <i 
                  className="fas fa-shopping-bag mb-3" 
                  style={{ fontSize: '4rem', color: 'var(--cafe-secondary)' }}
                ></i>
                <h3 className="fw-bold mb-3" style={{ color: 'var(--cafe-primary)' }}>
                  Takeout
                </h3>
                <p className="text-muted mb-4">
                  For customers taking their order to go. Quick and convenient service.
                </p>
                <button className="btn btn-cafe-secondary px-4 py-2">
                  Start Takeout Order
                  <i className="fas fa-arrow-right ms-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats Section */}
      <div className="row mt-5">
        <div className="col-12">
          <h4 className="text-center mb-4" style={{ color: 'var(--cafe-primary)' }}>
            Today's Overview
          </h4>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card-cafe p-3 text-center">
            <i className="fas fa-shopping-cart text-primary mb-2" style={{ fontSize: '2rem', color: 'var(--cafe-primary)' }}></i>
            <h5 className="fw-bold mb-1">25</h5>
            <small className="text-muted">Orders Today</small>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card-cafe p-3 text-center">
            <i className="fas fa-dollar-sign text-success mb-2" style={{ fontSize: '2rem' }}></i>
            <h5 className="fw-bold mb-1">$520</h5>
            <small className="text-muted">Revenue</small>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card-cafe p-3 text-center">
            <i className="fas fa-users text-info mb-2" style={{ fontSize: '2rem' }}></i>
            <h5 className="fw-bold mb-1">18</h5>
            <small className="text-muted">Customers</small>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card-cafe p-3 text-center">
            <i className="fas fa-star text-warning mb-2" style={{ fontSize: '2rem' }}></i>
            <h5 className="fw-bold mb-1">4.8</h5>
            <small className="text-muted">Rating</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;