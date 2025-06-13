import React, { useState, useEffect } from 'react';
import './DeliveryAddress.css';
import { useNavigate } from 'react-router-dom';

const DeliveryAddress = () => {
  const navigate = useNavigate();
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [locationAllowed, setLocationAllowed] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    phone_no: '',
    house_building_name: '',
    street_area: '',
    landmark: '',
    city: '',
    state: '',
    pincode: ''
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('User not logged in');
    try {
      const res = await fetch('http://localhost:5000/api/address', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSavedAddresses(data.data || data);
    } catch (err) {
      console.error('Error fetching addresses:', err);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      phone_no: '',
      house_building_name: '',
      street_area: '',
      landmark: '',
      city: '',
      state: '',
      pincode: ''
    });
    setEditing(null);
    setLocationAllowed(false);
  };
const handleSubmit = async () => {
  const token = localStorage.getItem('token');
  const method = editing ? 'PUT' : 'POST';
  const url = editing
    ? `http://localhost:5000/api/address/${editing._id}`
    : `http://localhost:5000/api/address`;

  // 🔍 Build full address to fetch lat/lon
  const addressString = `${formData.house_building_name}, ${formData.street_area}, ${formData.landmark}, ${formData.city}, ${formData.pincode}, ${formData.state}, India`;

  try {
    // 🌐 Get coordinates
    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressString)}`);
    const geoData = await geoRes.json();
    const latitude = geoData[0]?.lat || null;
    const longitude = geoData[0]?.lon || null;

    const dataToSend = {
      ...formData,
      latitude,
      longitude
    };

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(dataToSend)
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
  } catch (err) {
    console.error('Error submitting address:', err);
    alert("❌ Failed to save address with location");
  }
};


  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!window.confirm('Are you sure you want to delete this address?')) return;

    try {
      await fetch(`http://localhost:5000/api/address/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedAddresses(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      console.error('Error deleting address:', err);
    }
  };

  const checkPincodeRadius = async () => {
    const pincode = formData.pincode.trim();
    if (!pincode) return alert("Please enter a valid pincode");

    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(pincode)}`
      );
      const geoData = await geoRes.json();

      if (geoData.length === 0) return alert("❌ No location found for this pincode");

      const userLat = parseFloat(geoData[0].lat);
      const userLng = parseFloat(geoData[0].lon);

      const storeRes = await fetch('http://localhost:5000/admin/get-store');
      const store = await storeRes.json();

      const distance = calculateDistance(userLat, userLng, store.latitude, store.longitude);

      if (distance <= store.deliveryRadius) {
        setLocationAllowed(true);
        alert(`✅ Delivery available (~${distance.toFixed(2)} km)`);
      } else {
        alert(`❌ You're outside the delivery area (~${distance.toFixed(2)} km)`);
      }
    } catch (err) {
      console.error("Error checking delivery area:", err);
      alert("❌ Could not validate delivery location.");
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = val => (val * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <div className="address-container">
      {!showForm ? (
        <>
          <div className="address-header">
            <h2>📬 Your Saved Addresses</h2>
            <div>
              <button className="primary" onClick={() => setShowForm(true)}>➕ Add New</button>
              <button className="secondary" onClick={() => navigate('/check-location')}>
                📍 Check Delivery Location
              </button>
            </div>
          </div>

          {savedAddresses.length === 0 ? (
            <p>No addresses found.</p>
          ) : (
            <div className="address-list">
              {savedAddresses.map(address => (
                <div key={address._id} className="address-card">
                  <h3>{address.full_name}</h3>
                  <p>{address.phone_no}</p>
                  <p>
                    {address.house_building_name}, {address.street_area},<br />
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                  {address.landmark && <p><em>Landmark:</em> {address.landmark}</p>}
                  <div className="address-actions">
                    <button className="primary" onClick={() => {
                      setEditing(address);
                      setFormData(address);
                      setShowForm(true);
                      setLocationAllowed(true);
                    }}>✏️ Edit</button>
                    <button className="danger" onClick={() => handleDelete(address._id)}>🗑 Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="address-form">
          <h2>{editing ? '✏️ Edit Address' : '➕ Add New Address'}</h2>

          {!locationAllowed ? (
            <>
              <div className="pincode-check">
                <input
                  name="pincode"
                  placeholder="Enter Pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                />
                <button className="autofill-btn" onClick={checkPincodeRadius}>
                  🚚 Check Delivery Availability
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="form-grid">
                <input name="full_name" placeholder="Full Name" value={formData.full_name} onChange={handleChange} />
                <input name="phone_no" placeholder="Phone Number" value={formData.phone_no} onChange={handleChange} />
                <input name="house_building_name" placeholder="House/Building Name" value={formData.house_building_name} onChange={handleChange} />
                <input name="street_area" placeholder="Street/Area" value={formData.street_area} onChange={handleChange} />
                <input name="landmark" placeholder="Landmark (Optional)" value={formData.landmark} onChange={handleChange} />
                <input name="city" placeholder="City" value={formData.city} onChange={handleChange} />
                <input name="state" placeholder="State" value={formData.state} onChange={handleChange} />
                <input name="pincode" placeholder="Pincode" value={formData.pincode} disabled />
              </div>

              <div className="form-actions">
                <button className="success" onClick={handleSubmit}>
                  {editing ? 'Update Address' : 'Save Address'}
                </button>
                <button className="secondary" onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}>
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DeliveryAddress;
