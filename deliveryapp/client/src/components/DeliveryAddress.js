import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './DeliveryAddress.css';

const DeliveryAddress = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    state: '', full_name: '', phone_no: '', house_building_name: '',
    street_area: '', landmark: '', pincode: '', city: ''
  });

  useEffect(() => {
    fetchSavedAddresses();
  }, []);

  const fetchSavedAddresses = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('User not logged in!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/address', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setSavedAddresses(data.data || data);
      } else {
        console.error('Failed to fetch addresses');
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => alert('Location detected! Integrate geocoding API here.'),
        () => alert('Unable to get your location.')
      );
    } else {
      alert('Geolocation is not supported.');
    }
  };

  const resetForm = () => {
    setFormData({
      state: '', full_name: '', phone_no: '', house_building_name: '',
      street_area: '', landmark: '', pincode: '', city: ''
    });
    setEditingAddress(null);
  };

  const handleAddNew = () => {
    resetForm();
    setShowAddForm(true);
  };

  const handleEdit = (address) => {
    setFormData({ ...address });
    setEditingAddress(address);
    setShowAddForm(true);
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm('Are you sure?')) return;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:5000/api/address/${addressId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        setSavedAddresses(savedAddresses.filter(addr => addr._id !== addressId));
        alert('Deleted!');
      } else {
        alert('Delete failed.');
      }
    } catch (error) {
      alert('Error deleting address');
    }
  };

  const handleSubmit = async () => {
    if (!formData.state || !formData.full_name || !formData.phone_no) {
      alert('Please fill all required fields');
      return;
    }

    const token = localStorage.getItem('token');
    const url = editingAddress
      ? `http://localhost:5000/api/address/${editingAddress._id}`
      : 'http://localhost:5000/api/address';

    const method = editingAddress ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        if (editingAddress) {
          setSavedAddresses(savedAddresses.map(addr =>
            addr._id === editingAddress._id ? data.data || data : addr
          ));
        } else {
          setSavedAddresses([...savedAddresses, data.data || data]);
        }
        alert('Address saved!');
        resetForm();
        setShowAddForm(false);
      } else {
        alert('Failed to save address');
      }
    } catch {
      alert('Error saving address');
    }
  };

  const handleCancel = () => {
    resetForm();
    setShowAddForm(false);
  };

  const handleSelectAddress = (address) => {
    const state = location.state || {};
    navigate('/OrderConfirmation', {
      state: {
        ...state,
        selectedAddress: address
      }
    });
  };

  if (loading) {
    return <div className="address-container"><div>Loading addresses...</div></div>;
  }

  return (
    <div className="address-container">
      {!showAddForm ? (
        <div className="address-list-section">
          <div className="address-header">
            <h2>Your Delivery Addresses</h2>
            <button onClick={handleAddNew} className="add-new-btn">Add New Address</button>
          </div>

          {savedAddresses.length === 0 ? (
            <div>No saved addresses. Add one!</div>
          ) : (
            <div className="addresses-grid">
              {savedAddresses.map((address) => (
                <div key={address._id} className="address-item">
                  <div className="address-content">
                    <h3>{address.full_name}</h3>
                    <p>{address.phone_no}</p>
                    <p>{address.house_building_name}, {address.street_area}</p>
                    <p>{address.city}, {address.state} - {address.pincode}</p>
                    {address.landmark && <p>Landmark: {address.landmark}</p>}
                  </div>
                  <div className="address-actions">
                    <button onClick={() => handleEdit(address)}>Edit</button>
                    <button onClick={() => handleDelete(address._id)}>Delete</button>
                    <button onClick={() => handleSelectAddress(address)}>Use This Address</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="address-card">
          <h2>{editingAddress ? 'Edit' : 'Add'} Address</h2>

          <select name="state" value={formData.state} onChange={handleChange} required>
            <option value="">Select State *</option>
            <option value="Kerala">Kerala</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Telangana">Telangana</option>
          </select>

          <input name="full_name" placeholder="Full Name *" value={formData.full_name} onChange={handleChange} required />
          <input name="phone_no" placeholder="Phone *" value={formData.phone_no} onChange={handleChange} required />
          <button onClick={handleUseLocation}>📍 Use My Location</button>
          <input name="house_building_name" placeholder="Building" value={formData.house_building_name} onChange={handleChange} />
          <input name="street_area" placeholder="Street" value={formData.street_area} onChange={handleChange} />
          <input name="landmark" placeholder="Landmark (optional)" value={formData.landmark} onChange={handleChange} />
          <input name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} />
          <input name="city" placeholder="City" value={formData.city} onChange={handleChange} />

          <div className="form-buttons">
            <button onClick={handleCancel}>Cancel</button>
            <button onClick={handleSubmit}>{editingAddress ? 'Update' : 'Save'} Address</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryAddress;
