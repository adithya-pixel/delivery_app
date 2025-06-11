import React, { useState, useEffect } from 'react';
import './DeliveryAddress.css';

const DeliveryAddress = () => {
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    state: '',
    full_name: '',
    phone_no: '',
    house_building_name: '',
    street_area: '',
    landmark: '',
    pincode: '',
    city: '',
  });

  // Fetch saved addresses when component mounts
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSavedAddresses(data.data || data); // Handle different response structures
        console.log('Addresses fetched:', data);
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
    console.log('Use my location clicked');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location:', position.coords.latitude, position.coords.longitude);
          // You can use reverse geocoding API to get address from coordinates
          alert('Location detected! You can integrate with geocoding API to auto-fill address.');
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enter address manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const resetForm = () => {
    setFormData({
      state: '',
      full_name: '',
      phone_no: '',
      house_building_name: '',
      street_area: '',
      landmark: '',
      pincode: '',
      city: '',
    });
    setEditingAddress(null);
  };

  const handleAddNew = () => {
    resetForm();
    setShowAddForm(true);
  };

  const handleEdit = (address) => {
    setFormData({
      state: address.state || '',
      full_name: address.full_name || '',
      phone_no: address.phone_no || '',
      house_building_name: address.house_building_name || '',
      street_area: address.street_area || '',
      landmark: address.landmark || '',
      pincode: address.pincode || '',
      city: address.city || '',
    });
    setEditingAddress(address);
    setShowAddForm(true);
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/address/${addressId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSavedAddresses(savedAddresses.filter(addr => addr._id !== addressId));
        alert('Address deleted successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to delete address: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Something went wrong while deleting address');
    }
  };

  const handleSubmit = async () => {
    if (!formData.state || !formData.full_name || !formData.phone_no) {
      alert('Please fill in all required fields (State, Full Name, Phone Number)');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('User not logged in!');
      return;
    }

    try {
      const url = editingAddress 
        ? `http://localhost:5000/api/address/${editingAddress._id}`
        : 'http://localhost:5000/api/address';
      
      const method = editingAddress ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Address saved:', data);
        
        if (editingAddress) {
          // Update the address in the list
          setSavedAddresses(savedAddresses.map(addr => 
            addr._id === editingAddress._id ? data.data || data : addr
          ));
          alert('Address updated successfully!');
        } else {
          // Add new address to the list
          setSavedAddresses([...savedAddresses, data.data || data]);
          alert('Address added successfully!');
        }
        
        // Reset form and hide it
        resetForm();
        setShowAddForm(false);
      } else {
        const errorData = await response.json();
        alert(`Failed to save address: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong while saving address');
    }
  };

  const handleCancel = () => {
    resetForm();
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <div className="address-container">
        <div className="loading">Loading your addresses...</div>
      </div>
    );
  }

  return (
    <div className="address-container">
      {!showAddForm ? (
        <div className="address-list-section">
          <div className="address-header">
            <h2>Your Delivery Addresses</h2>
            <button onClick={handleAddNew} className="add-new-btn">
              Add New Address
            </button>
          </div>

          {savedAddresses.length === 0 ? (
            <div className="no-addresses">
              <p>No saved addresses found.</p>
              <button onClick={handleAddNew} className="add-first-btn">
                Add Your First Address
              </button>
            </div>
          ) : (
            <div className="addresses-grid">
              {savedAddresses.map((address) => (
                <div key={address._id} className="address-item">
                  <div className="address-content">
                    <h3>{address.full_name}</h3>
                    <p className="phone">{address.phone_no}</p>
                    <div className="address-details">
                      <p>{address.house_building_name}</p>
                      <p>{address.street_area}</p>
                      {address.landmark && <p>Landmark: {address.landmark}</p>}
                      <p>{address.city}, {address.state} - {address.pincode}</p>
                    </div>
                  </div>
                  <div className="address-actions">
                    <button 
                      onClick={() => handleEdit(address)} 
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(address._id)} 
                      className="delete-btn"
                    >
                      Delete
                    </button>
                    <button className="use-btn">
                      Use This Address
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="address-card">
          <h2>
            {editingAddress ? 'Edit Delivery Address' : 'Enter a New Delivery Address'}
          </h2>

          <select 
            name="state" 
            value={formData.state} 
            onChange={handleChange}
            required
          >
            <option value="">Select State *</option>
            <option value="Kerala">Kerala</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Telangana">Telangana</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Punjab">Punjab</option>
            <option value="Delhi">Delhi</option>
          </select>

          <input
            type="text"
            name="full_name"
            placeholder="Full Name *"
            value={formData.full_name}
            onChange={handleChange}
            required
          />

          <input
            type="tel"
            name="phone_no"
            placeholder="Mobile Number *"
            value={formData.phone_no}
            onChange={handleChange}
            required
          />

          <button onClick={handleUseLocation} className="location-btn">
            📍 Use My Location
          </button>

          <input
            type="text"
            name="house_building_name"
            placeholder="House / Building Name"
            value={formData.house_building_name}
            onChange={handleChange}
          />

          <input
            type="text"
            name="street_area"
            placeholder="Area / Street"
            value={formData.street_area}
            onChange={handleChange}
          />

          <input
            type="text"
            name="landmark"
            placeholder="Landmark (Optional)"
            value={formData.landmark}
            onChange={handleChange}
          />

          <div className="row">
            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={formData.pincode}
              onChange={handleChange}
            />
            <input
              type="text"
              name="city"
              placeholder="Town / City"
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          <div className="form-buttons">
            <button onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
            <button onClick={handleSubmit} className="submit-btn">
              {editingAddress ? 'Update Address' : 'Save Address'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryAddress;