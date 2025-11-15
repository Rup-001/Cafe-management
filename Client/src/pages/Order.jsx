import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Order = () => {
  const [orderDetails, setOrderDetails] = useState({
    customerName: '',
    customerPhone: '',
    paymentMethod: 'cash',
    discountPercentage: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [barista, setBarista] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedItems, orderType, tableNo, totalAmount, baristaId } = location.state || {};

  const user = JSON.parse(localStorage.getItem('user'));

  // Debug location.state
  useEffect(() => {
    console.log('Order - location.state:', location.state);
  }, [location.state]);

  // Fetch barista details
  useEffect(() => {
    if (baristaId) {
      const fetchBarista = async () => {
        try {
          const response = await api.get('/AllUser');
          console.log('fetchBarista - AllUser Response:', response.data);
          const barista = response.data.find(b => b._id === baristaId);
          if (barista) {
            setBarista(barista);
          } else {
            console.error('Barista not found for ID:', baristaId);
            setError('Barista not found. Please go back and select a barista.');
          }
        } catch (error) {
          console.error('fetchBarista - Error:', error.response || error.message);
          setError('Failed to fetch barista details. Please try again.');
        }
      };
      fetchBarista();
    } else if (orderType === 'dine-in') {
      console.warn('No baristaId provided for dine-in order');
      setError('No barista selected. Please go back and select a barista.');
      navigate('/dashboard');
    }
  }, [baristaId, orderType, navigate]);

  const handleChange = (e) => {
    setOrderDetails({
      ...orderDetails,
      [e.target.name]: e.target.value
    });
  };

  const calculateDiscountedTotal = () => {
    const discount = (totalAmount * orderDetails.discountPercentage) / 100;
    return totalAmount - discount;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orderData = {
        userId: user.id,
        items: selectedItems.map(item => ({
          itemId: item._id,
          quantity: item.quantity
        })),
        customerName: orderDetails.customerName,
        customerPhone: orderDetails.customerPhone,
        orderType: orderType,
        paymentMethod: orderDetails.paymentMethod,
        discountPercentage: parseFloat(orderDetails.discountPercentage) || 0,
        responsibleBarista: baristaId || user.id
      };

      if (orderType === 'dine-in') {
        orderData.tableNo = tableNo;
      }

      console.log('Order - orderData:', orderData);
      const response = await api.post('/order', orderData);
      const orderId = response.data._id || response.data.id;
      
      navigate(`/invoice/${orderId}`);
    } catch (error) {
      console.error('Order - Submit Error:', error.response || error.message);
      setError(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedItems || selectedItems.length === 0) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold" style={{ color: 'var(--cafe-primary)' }}>
                <i className="fas fa-receipt me-2"></i>
                Complete Order
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
              onClick={() => navigate('/menu', { state: { orderType, tableNo, baristaId } })}
            >
              <i className="fas fa-arrow-left me-2"></i>
              Back to Menu
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row">
        <div className="col-lg-8">
          <div className="card-cafe">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-4" style={{ color: 'var(--cafe-primary)' }}>
                Customer Information
              </h5>
              
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="customerName" className="form-label fw-medium">
                      Customer Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-cafe"
                      id="customerName"
                      name="customerName"
                      value={orderDetails.customerName}
                      onChange={handleChange}
                      required
                      placeholder="Enter customer name"
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="customerPhone" className="form-label fw-medium">
                      Phone Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      className="form-control form-control-cafe"
                      id="customerPhone"
                      name="customerPhone"
                      value={orderDetails.customerPhone}
                      onChange={handleChange}
                      required
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="paymentMethod" className="form-label fw-medium">
                      Payment Method
                    </label>
                    <select
                      className="form-control form-control-cafe"
                      id="paymentMethod"
                      name="paymentMethod"
                      value={orderDetails.paymentMethod}
                      onChange={handleChange}
                    >
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="bkash">bKash</option>
                      <option value="nagad">Nagad</option>
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="discountPercentage" className="form-label fw-medium">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      className="form-control form-control-cafe"
                      id="discountPercentage"
                      name="discountPercentage"
                      value={orderDetails.discountPercentage}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      placeholder="Enter discount percentage"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-cafe-primary w-100 mt-3"
                  disabled={loading || (orderType === 'dine-in' && !baristaId)}
                >
                  {loading ? (
                    <>
                      <span className="loading-spinner me-2"></span>
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check me-2"></i>
                      Place Order
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card-cafe sticky-top" style={{ top: '100px' }}>
            <div className="card-body">
              <h5 className="card-title fw-bold mb-3" style={{ color: 'var(--cafe-primary)' }}>
                <i className="fas fa-list me-2"></i>
                Order Summary
              </h5>
              
              <div className="mb-3">
                {selectedItems.map((item) => (
                  <div key={item._id} className="d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded">
                    <div>
                      <h6 className="mb-1">{item.name}</h6>
                      <small className="text-muted">
                        ${item.price} × {item.quantity}
                      </small>
                    </div>
                    <span className="fw-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              
              <hr />
              
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              
              {orderDetails.discountPercentage > 0 && (
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>Discount ({orderDetails.discountPercentage}%):</span>
                  <span>-${((totalAmount * orderDetails.discountPercentage) / 100).toFixed(2)}</span>
                </div>
              )}
              
              <hr />
              
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-bold">Total:</h5>
                <h5 className="fw-bold" style={{ color: 'var(--cafe-primary)' }}>
                  ${calculateDiscountedTotal().toFixed(2)}
                </h5>
              </div>

              <div className="mt-3 p-3 bg-light rounded">
                <h6 className="fw-bold mb-2">Order Details:</h6>
                <small className="text-muted">
                  <strong>Type:</strong> {orderType === 'dine-in' ? `Dine In (Table ${tableNo})` : 'Takeout'}<br />
                  <strong>Items:</strong> {selectedItems.length}<br />
                  <strong>Served by:</strong> {barista ? barista.username : (orderType === 'takeout' ? user.username : 'No barista selected')}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;