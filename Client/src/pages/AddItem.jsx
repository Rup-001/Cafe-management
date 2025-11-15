import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AddItem = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'coffee',
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const categories = ['coffee', 'tea', 'pastry', 'sandwich', 'beverage', 'dessert'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // First create the item
      const itemData = {
        ...formData,
        price: parseFloat(formData.price)
      };
      
      const response = await api.post('/items', itemData);
      const itemId = response.data._id || response.data.id;

      // If there's an image file, upload it
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);
        
        await api.post(`/items/${itemId}/upload-image`, imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      setSuccess('Item added successfully!');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'coffee',
        imageUrl: ''
      });
      setImageFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('imageFile');
      if (fileInput) fileInput.value = '';

      setTimeout(() => {
        setSuccess('');
      }, 3000);
      
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add item. Please try again.');
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
                Add New Item
              </h2>
              <p className="text-muted">Add a new menu item to your cafe</p>
            </div>
            <button 
              className="btn btn-outline-secondary"
              onClick={() => navigate('/show-items')}
            >
              <i className="fas fa-list me-2"></i>
              View All Items
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
                    <label htmlFor="name" className="form-label fw-medium">
                      Item Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-cafe"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter item name"
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="category" className="form-label fw-medium">
                      Category <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control form-control-cafe"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="price" className="form-label fw-medium">
                      Price ($) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="form-control form-control-cafe"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      placeholder="0.00"
                    />
                  </div>

                   <div className="col-md-6 mb-3">
                     <label htmlFor="image" className="form-label fw-medium">
                       Upload Image (Optional)
                     </label>
                     <input
                       type="file"
                       className="form-control form-control-cafe"
                       id="image"
                       name="image"
                       accept="image/*"
                       onChange={handleImageChange}
                     />
                   </div>

                  <div className="col-12 mb-3">
                    <label htmlFor="description" className="form-label fw-medium">
                      Description
                    </label>
                    <textarea
                      className="form-control form-control-cafe"
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Enter item description"
                    ></textarea>
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
                        Add Item
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

export default AddItem;