import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const ShowInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await api.get('/inventory');
      setInventory(response.data);
    } catch (error) {
      setError('Failed to load inventory');
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item._id);
    setEditFormData({
      itemName: item.itemName,
      quantity: item.quantity,
      unit: item.unit,
      supplier: item.supplier,
      cost: item.cost,
      expiryDate: item.expiryDate ? item.expiryDate.split('T')[0] : ''
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async (itemId) => {
    try {
      const updateData = {
        ...editFormData,
        quantity: parseFloat(editFormData.quantity),
        cost: parseFloat(editFormData.cost)
      };
      
      await api.put(`/inventory/${itemId}`, updateData);
      
      // Update local state
      setInventory(inventory.map(item => 
        item._id === itemId 
          ? { ...item, ...updateData }
          : item
      ));
      
      setEditingItem(null);
      setEditFormData({});
    } catch (error) {
      setError('Failed to update inventory item');
      console.error('Error updating inventory:', error);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this inventory item?')) {
      return;
    }
    
    try {
      await api.delete(`/inventory/${itemId}`);
      setInventory(inventory.filter(item => item._id !== itemId));
    } catch (error) {
      setError('Failed to delete inventory item');
      console.error('Error deleting inventory:', error);
    }
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditFormData({});
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US');
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p className="mt-2">Loading inventory...</p>
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
                <i className="fas fa-boxes me-2"></i>
                Inventory Management
              </h2>
              <p className="text-muted">Manage your cafe inventory items</p>
            </div>
            <Link to="/add-inventory" className="btn btn-cafe-primary">
              <i className="fas fa-plus me-2"></i>
              Add Inventory Item
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {inventory.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-boxes" style={{ fontSize: '4rem', color: 'var(--cafe-primary)' }}></i>
          <h4 className="mt-3" style={{ color: 'var(--cafe-primary)' }}>No Inventory Items Found</h4>
          <p className="text-muted">Start by adding your first inventory item</p>
          <Link to="/add-inventory" className="btn btn-cafe-primary">
            <i className="fas fa-plus me-2"></i>
            Add First Item
          </Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead style={{ backgroundColor: 'var(--cafe-primary)', color: 'white' }}>
              <tr>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Supplier</th>
                <th>Cost</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item._id}>
                  {editingItem === item._id ? (
                    // Edit mode
                    <>
                      <td>
                        <input
                          type="text"
                          className="form-control form-control-cafe"
                          name="itemName"
                          value={editFormData.itemName}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control form-control-cafe"
                          name="quantity"
                          value={editFormData.quantity}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td>
                        <select
                          className="form-control form-control-cafe"
                          name="unit"
                          value={editFormData.unit}
                          onChange={handleEditChange}
                        >
                          <option value="kg">Kg</option>
                          <option value="lbs">Lbs</option>
                          <option value="pieces">Pieces</option>
                          <option value="liters">Liters</option>
                          <option value="gallons">Gallons</option>
                          <option value="boxes">Boxes</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control form-control-cafe"
                          name="supplier"
                          value={editFormData.supplier}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control form-control-cafe"
                          name="cost"
                          value={editFormData.cost}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          className="form-control form-control-cafe"
                          name="expiryDate"
                          value={editFormData.expiryDate}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td>-</td>
                      <td>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleUpdate(item._id)}
                          >
                            <i className="fas fa-save"></i>
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={cancelEdit}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    // Display mode
                    <>
                      <td className="fw-bold">{item.itemName}</td>
                      <td>{item.quantity}</td>
                      <td>{item.unit}</td>
                      <td>{item.supplier}</td>
                      <td>${item.cost?.toFixed(2)}</td>
                      <td>{formatDate(item.expiryDate)}</td>
                      <td>
                        {isExpired(item.expiryDate) ? (
                          <span className="badge bg-danger">Expired</span>
                        ) : isExpiringSoon(item.expiryDate) ? (
                          <span className="badge bg-warning">Expiring Soon</span>
                        ) : item.quantity <= 5 ? (
                          <span className="badge bg-warning">Low Stock</span>
                        ) : (
                          <span className="badge bg-success">Good</span>
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-cafe-secondary btn-sm"
                            onClick={() => handleEdit(item)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(item._id)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ShowInventory;