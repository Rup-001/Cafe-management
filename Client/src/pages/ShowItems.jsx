import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const ShowItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await api.get('/items');
      setItems(response.data);
    } catch (error) {
      setError('Failed to load items');
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item._id);
    setEditFormData({
      name: item.name,
      description: item.description || '',
      price: item.price,
      category: item.category,
      imageUrl: item.imageUrl || ''
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
        price: parseFloat(editFormData.price)
      };
      
      await api.put(`/items/${itemId}`, updateData);
      
      // Update local state
      setItems(items.map(item => 
        item._id === itemId 
          ? { ...item, ...updateData }
          : item
      ));
      
      setEditingItem(null);
      setEditFormData({});
    } catch (error) {
      setError('Failed to update item');
      console.error('Error updating item:', error);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }
    
    try {
      await api.delete(`/items/${itemId}`);
      setItems(items.filter(item => item._id !== itemId));
    } catch (error) {
      setError('Failed to delete item');
      console.error('Error deleting item:', error);
    }
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditFormData({});
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p className="mt-2">Loading items...</p>
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
                <i className="fas fa-list me-2"></i>
                Menu Items
              </h2>
              <p className="text-muted">Manage your cafe menu items</p>
            </div>
            <Link to="/add-item" className="btn btn-cafe-primary">
              <i className="fas fa-plus me-2"></i>
              Add New Item
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row">
        {items.length === 0 ? (
          <div className="col-12">
            <div className="text-center py-5">
              <i className="fas fa-coffee" style={{ fontSize: '4rem', color: 'var(--cafe-primary)' }}></i>
              <h4 className="mt-3" style={{ color: 'var(--cafe-primary)' }}>No Items Found</h4>
              <p className="text-muted">Start by adding your first menu item</p>
              <Link to="/add-item" className="btn btn-cafe-primary">
                <i className="fas fa-plus me-2"></i>
                Add First Item
              </Link>
            </div>
          </div>
        ) : (
          items.map((item) => (
            <div key={item._id} className="col-lg-6 col-xl-4 mb-4">
              <div className="card menu-item-card h-100">
                <img
                  src={item.imageUrl || 'https://via.placeholder.com/300x200/8B4513/FFFFFF?text=No+Image'}
                  alt={item.name}
                  className="menu-item-image"
                />
                <div className="card-body d-flex flex-column">
                  {editingItem === item._id ? (
                    // Edit form
                    <div>
                      <div className="mb-2">
                        <input
                          type="text"
                          className="form-control form-control-cafe"
                          name="name"
                          value={editFormData.name}
                          onChange={handleEditChange}
                          placeholder="Item name"
                        />
                      </div>
                      <div className="mb-2">
                        <textarea
                          className="form-control form-control-cafe"
                          name="description"
                          value={editFormData.description}
                          onChange={handleEditChange}
                          placeholder="Description"
                          rows="2"
                        ></textarea>
                      </div>
                      <div className="row mb-2">
                        <div className="col-6">
                          <input
                            type="number"
                            step="0.01"
                            className="form-control form-control-cafe"
                            name="price"
                            value={editFormData.price}
                            onChange={handleEditChange}
                            placeholder="Price"
                          />
                        </div>
                        <div className="col-6">
                          <select
                            className="form-control form-control-cafe"
                            name="category"
                            value={editFormData.category}
                            onChange={handleEditChange}
                          >
                            <option value="coffee">Coffee</option>
                            <option value="tea">Tea</option>
                            <option value="pastry">Pastry</option>
                            <option value="sandwich">Sandwich</option>
                            <option value="beverage">Beverage</option>
                            <option value="dessert">Dessert</option>
                          </select>
                        </div>
                      </div>
                      <div className="mb-2">
                        <input
                          type="url"
                          className="form-control form-control-cafe"
                          name="imageUrl"
                          value={editFormData.imageUrl}
                          onChange={handleEditChange}
                          placeholder="Image URL"
                        />
                      </div>
                      <div className="d-flex gap-2">
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
                    </div>
                  ) : (
                    // Display mode
                    <>
                      <h5 className="card-title fw-bold">{item.name}</h5>
                      <p className="card-text text-muted flex-grow-1">
                        {item.description || 'No description available'}
                      </p>
                      <div className="mb-2">
                        <span className="badge bg-secondary me-2">
                          {item.category?.charAt(0).toUpperCase() + item.category?.slice(1)}
                        </span>
                        <span className="price-tag">${item.price}</span>
                      </div>
                      <div className="d-flex gap-2 mt-auto">
                        <button
                          className="btn btn-cafe-secondary btn-sm flex-grow-1"
                          onClick={() => handleEdit(item)}
                        >
                          <i className="fas fa-edit me-1"></i>
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(item._id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ShowItems;