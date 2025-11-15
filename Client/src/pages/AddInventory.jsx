import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AddInventory = () => {
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    unit: 'kg',
    supplier: '',
    cost: '',
    expiryDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const units = ['kg', 'lbs', 'pieces', 'liters', 'gallons', 'boxes'];

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

    try {
      const inventoryData = {
        ...formData,
        quantity: parseFloat(formData.quantity),
        cost: parseFloat(formData.cost)
      };

      await api.post('/inventory', inventoryData);
      
      setSuccess('Inventory item added successfully!');
      
      // Reset form
      setFormData({
        itemName: '',
        quantity: '',
        unit: 'kg',
        supplier: '',
        cost: '',
        expiryDate: ''
      });

      setTimeout(() => {
        setSuccess('');
      }, 3000);
      
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add inventory item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold" style={{ color: 'var(--cafe-primary)' }}>
                <i className="fas fa-plus-circle me-2"></i>
                Add Inventory Item
              </h2>
              <p className="text-muted">Add a new item to your inventory</p>
            </div>
            <button 
              className="btn btn-outline-secondary"
              onClick={() => navigate('/show-inventory')}
            >
              <i className="fas fa-list me-2"></i>
              View Inventory
            </button>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card-cafe">
            <div className="card-body">
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
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="itemName" className="form-label fw-medium">
                      Item Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-cafe"
                      id="itemName"
                      name="itemName"
                      value={formData.itemName}
                      onChange={handleChange}
                      required
                      placeholder="Enter item name"
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="supplier" className="form-label fw-medium">
                      Supplier <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-cafe"
                      id="supplier"
                      name="supplier"
                      value={formData.supplier}
                      onChange={handleChange}
                      required
                      placeholder="Enter supplier name"
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label htmlFor="quantity" className="form-label fw-medium">
                      Quantity <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="form-control form-control-cafe"
                      id="quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      required
                      placeholder="0.00"
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label htmlFor="unit" className="form-label fw-medium">
                      Unit <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control form-control-cafe"
                      id="unit"
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      required
                    >
                      {units.map(unit => (
                        <option key={unit} value={unit}>
                          {unit.charAt(0).toUpperCase() + unit.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-4 mb-3">
                    <label htmlFor="cost" className="form-label fw-medium">
                      Cost ($) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="form-control form-control-cafe"
                      id="cost"
                      name="cost"
                      value={formData.cost}
                      onChange={handleChange}
                      required
                      placeholder="0.00"
                    />
                  </div>

                  <div className="col-md-6 mb-4">
                    <label htmlFor="expiryDate" className="form-label fw-medium">
                      Expiry Date (Optional)
                    </label>
                    <input
                      type="date"
                      className="form-control form-control-cafe"
                      id="expiryDate"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-cafe-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="loading-spinner me-2"></span>
                        Adding Item...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        Add to Inventory
                      </>
                    )}
                  </button>
                  
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/dashboard')}
                  >
                    <i className="fas fa-times me-2"></i>
                    Cancel
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

export default AddInventory;