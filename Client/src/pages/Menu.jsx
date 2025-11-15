import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const location = useLocation();
  const navigate = useNavigate();
  const { orderType, tableNo, baristaId } = location.state || {}; // Added baristaId

  const categories = ['all', 'coffee', 'tea', 'pastry', 'sandwich', 'beverage'];

  useEffect(() => {
    console.log('Menu - location.state:', location.state); // Debug
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await api.get('/menu');
      setMenuItems(response.data);
    } catch (error) {
      setError('Failed to load menu items');
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToOrder = (item) => {
    const existingItem = selectedItems.find(selected => selected._id === item._id);
    
    if (existingItem) {
      setSelectedItems(selectedItems.map(selected =>
        selected._id === item._id
          ? { ...selected, quantity: selected.quantity + 1 }
          : selected
      ));
    } else {
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    }
  };

  const removeFromOrder = (itemId) => {
    const existingItem = selectedItems.find(selected => selected._id === itemId);
    
    if (existingItem && existingItem.quantity > 1) {
      setSelectedItems(selectedItems.map(selected =>
        selected._id === itemId
          ? { ...selected, quantity: selected.quantity - 1 }
          : selected
      ));
    } else {
      setSelectedItems(selectedItems.filter(selected => selected._id !== itemId));
    }
  };

  const getTotalAmount = () => {
    return selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const proceedToOrder = () => {
    if (selectedItems.length === 0) {
      alert('Please select at least one item');
      return;
    }
    
    console.log('Menu - Navigating to /order with state:', { 
      selectedItems, 
      orderType, 
      tableNo,
      totalAmount: getTotalAmount(),
      baristaId
    }); // Debug
    navigate('/order', { 
      state: { 
        selectedItems, 
        orderType, 
        tableNo,
        totalAmount: getTotalAmount(),
        baristaId // Added baristaId
      } 
    });
  };

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category?.toLowerCase() === selectedCategory);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p className="mt-2">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold" style={{ color: 'var(--cafe-primary)' }}>
                <i className="fas fa-utensils me-2"></i>
                Our Menu
              </h2>
              <p className="text-muted">
                {orderType === 'dine-in' 
                  ? `Table ${tableNo} - Dine In Order` 
                  : 'Takeout Order'
                }
              </p>
            </div>
            <button 
              className="btn btn-outline-secondary"
              onClick={() => navigate('/dashboard')}
            >
              <i className="fas fa-arrow-left me-2"></i>
              Back
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Category Filter */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            {categories.map(category => (
              <button
                key={category}
                className={`btn ${selectedCategory === category ? 'btn-cafe-primary' : 'btn-outline-secondary'}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="row">
        {/* Menu Items */}
        <div className="col-lg-8">
          <div className="row">
            {filteredItems.map((item) => (
              <div key={item._id} className="col-md-6 col-lg-4 mb-4">
                <div className="card menu-item-card h-100">
                  <img
                    src={item.imageUrl || 'https://via.placeholder.com/300x200/8B4513/FFFFFF?text=No+Image'}
                    alt={item.name}
                    className="menu-item-image"
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold">{item.name}</h5>
                    <p className="card-text text-muted flex-grow-1">{item.description}</p>
                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <span className="price-tag">${item.price}</span>
                      <button
                        className="btn btn-cafe-primary btn-sm"
                        onClick={() => addToOrder(item)}
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredItems.length === 0 && (
            <div className="text-center py-5">
              <i className="fas fa-search" style={{ fontSize: '3rem', color: 'var(--cafe-primary)' }}></i>
              <h4 className="mt-3">No items found</h4>
              <p className="text-muted">Try selecting a different category</p>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="card-cafe sticky-top" style={{ top: '100px' }}>
            <div className="card-body">
              <h5 className="card-title fw-bold mb-3" style={{ color: 'var(--cafe-primary)' }}>
                <i className="fas fa-shopping-cart me-2"></i>
                Order Summary
              </h5>
              
              {selectedItems.length === 0 ? (
                <p className="text-muted text-center py-3">No items selected</p>
              ) : (
                <>
                  <div className="mb-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {selectedItems.map((item) => (
                      <div key={item._id} className="d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded">
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{item.name}</h6>
                          <small className="text-muted">${item.price} each</small>
                        </div>
                        <div className="d-flex align-items-center">
                          <button
                            className="btn btn-sm btn-outline-danger me-2"
                            onClick={() => removeFromOrder(item._id)}
                          >
                            <i className="fas fa-minus"></i>
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button
                            className="btn btn-sm btn-outline-success ms-2"
                            onClick={() => addToOrder(item)}
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <hr />
                  
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold">Total:</h5>
                    <h5 className="fw-bold" style={{ color: 'var(--cafe-primary)' }}>
                      ${getTotalAmount().toFixed(2)}
                    </h5>
                  </div>
                  
                  <button
                    className="btn btn-cafe-primary w-100"
                    onClick={proceedToOrder}
                  >
                    Proceed to Order
                    <i className="fas fa-arrow-right ms-2"></i>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;