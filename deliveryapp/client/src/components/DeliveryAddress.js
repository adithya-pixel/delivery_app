import React, { useState, useEffect } from 'react';
import './DeliveryAddress.css';
import { useNavigate } from 'react-router-dom';

const DeliveryAddress = () => {
  const navigate = useNavigate();
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '', phone_no: '', house_building_name: '',
    street_area: '', landmark: '', city: '', state: '', pincode: ''
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('User not logged in');
    const res = await fetch('http://localhost:5000/api/address', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setSavedAddresses(data.data || data);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setFormData({
      full_name: '', phone_no: '', house_building_name: '',
      street_area: '', landmark: '', city: '', state: '', pincode: ''
    });
    setEditing(null);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    const method = editing ? 'PUT' : 'POST';
    const url = editing
      ? `http://localhost:5000/api/address/${editing._id}`
      : `http://localhost:5000/api/address`;

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    if (editing) {
      setSavedAddresses(prev =>
        prev.map(a => (a._id === editing._id ? data.data || data : a))
      );
    } else {
      setSavedAddresses(prev => [...prev, data.data || data]);
    }

    resetForm();
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!window.confirm('Delete this address?')) return;

    await fetch(`http://localhost:5000/api/address/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    setSavedAddresses(prev => prev.filter(a => a._id !== id));
  };

  // 📍 Autofill using current location
  const autofillFromCurrentLocation = () => {
  if (!navigator.geolocation) {
    alert("❌ Geolocation not supported.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      alert(`📍 Coordinates: ${lat}, ${lon}`);

      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`, {
          headers: {
            'User-Agent': 'delivery-app/1.0',
            'Accept-Language': 'en'
          }
        });

        const data = await res.json();
        console.log("OSM Reverse Geocode Response:", data);

        const address = data.address || {};

        setFormData(prev => ({
          ...prev,
          house_building_name: address?.house_number || '',
          street_area: `${address?.road || ''} ${address?.suburb || ''}`.trim(),
          landmark: address?.neighbourhood || '',
          city: address?.city || address?.town || address?.village || '',
          state: address?.state || '',
          pincode: address?.postcode || ''
        }));
      } catch (err) {
        console.error(err);
        alert("❌ Failed to reverse geocode location.");
      }
    },
    (err) => {
      console.error(err);
      alert("❌ Location access denied or failed.");
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
};


  return (
    <div className="address-container">
      {!showForm ? (
        <>
          <h2>Your Saved Addresses</h2>
          <button className="primary" onClick={() => setShowForm(true)}>➕ Add New</button>
          <button className="secondary" onClick={() => navigate('/check-location')}>📍 Check Delivery Location</button>

          {savedAddresses.length === 0 ? (
            <p>No addresses found.</p>
          ) : (
            savedAddresses.map(address => (
              <div key={address._id} className="address-card">
                <h3>{address.full_name}</h3>
                <p>{address.phone_no}</p>
                <p>{address.house_building_name}, {address.street_area}, {address.city}, {address.state} - {address.pincode}</p>
                {address.landmark && <p>Landmark: {address.landmark}</p>}
                <button className="primary" onClick={() => {
                  setEditing(address);
                  setFormData(address);
                  setShowForm(true);
                }}>✏️ Edit</button>
                <button className="danger" onClick={() => handleDelete(address._id)}>🗑 Delete</button>
              </div>
            ))
          )}
        </>
      ) : (
        <div className="address-form">
          <h2>{editing ? 'Edit Address' : 'Add Address'}</h2>

          <button className="secondary" onClick={autofillFromCurrentLocation}>
            📍 Use My Location
          </button>

          <input name="full_name" placeholder="Full Name" value={formData.full_name} onChange={handleChange} />
          <input name="phone_no" placeholder="Phone" value={formData.phone_no} onChange={handleChange} />
          <input name="house_building_name" placeholder="House/Building" value={formData.house_building_name} onChange={handleChange} />
          <input name="street_area" placeholder="Street/Area" value={formData.street_area} onChange={handleChange} />
          <input name="landmark" placeholder="Landmark (optional)" value={formData.landmark} onChange={handleChange} />
          <input name="city" placeholder="City" value={formData.city} onChange={handleChange} />
          <input name="state" placeholder="State" value={formData.state} onChange={handleChange} />
          <input name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} />
          <button className="success" onClick={handleSubmit}>{editing ? 'Update' : 'Save'}</button>
          <button className="secondary" onClick={() => { resetForm(); setShowForm(false); }}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default DeliveryAddress;
