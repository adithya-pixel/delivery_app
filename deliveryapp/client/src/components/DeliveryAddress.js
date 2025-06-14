import React, { useState, useEffect } from 'react';
import './DeliveryAddress.css';
import { FaHome } from 'react-icons/fa';
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
    locality: '',
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
      locality: '',
      city: '',
      state: '',
      pincode: ''
    });
    setEditing(null);
    setLocationAllowed(false);
  };

  const fetchCoordinatesWithFallback = async (locality, city, state, pincode) => {
    const queries = [
      `${locality}, ${city}, ${state}, ${pincode}, India`,
      `${city}, ${state}, ${pincode}, India`,
      `${city}, ${state}, India`,
      `${state}, India`
    ];
    const API_KEY = "pk.75a44cd578adf726a3c447795496e4b7";
    for (let query of queries) {
      const response = await fetch(`https://us1.locationiq.com/v1/search.php?key=${API_KEY}&format=json&q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (data && data.length > 0) return data[0];
    }
    return null;
  };

  const checkPincodeRadius = async () => {
    const { pincode, locality, city, state } = formData;
    if (!pincode || !locality || !city || !state) {
      alert("❌ Please fill Pincode, City, Locality, and State before checking delivery.");
      return;
    }

    const API_KEY = "pk.75a44cd578adf726a3c447795496e4b7";
    const query = `${locality}, ${city}, ${state}, ${pincode}, India`;

    try {
      const response = await fetch(`https://us1.locationiq.com/v1/search.php?key=${API_KEY}&format=json&q=${encodeURIComponent(query)}`);
      const results = await response.json();
      if (!results || results.length === 0) {
        alert("❌ Could not find coordinates for this address.");
        return;
      }

      const matchedLocation = results[0];
      const userLat = parseFloat(matchedLocation.lat);
      const userLng = parseFloat(matchedLocation.lon);

      const storeRes = await fetch("http://localhost:5000/admin/get-store");
      const store = await storeRes.json();
      const storeLat = parseFloat(store.latitude);
      const storeLng = parseFloat(store.longitude);
      const deliveryRadius = parseFloat(store.deliveryRadius);

      const toRad = (val) => (val * Math.PI) / 180;
      const R = 6371;
      const dLat = toRad(storeLat - userLat);
      const dLon = toRad(storeLng - userLng);
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(userLat)) * Math.cos(toRad(storeLat)) * Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      if (distance > deliveryRadius) {
        alert(`❌ Sorry, this location is outside our delivery area (~${distance.toFixed(2)} km).`);
        return;
      }

      alert("✅ This location is serviceable. Please enter your full address.");
      setLocationAllowed(true);
    } catch (err) {
      console.error("Error checking pincode:", err);
      alert("❌ Error checking location.");
    }
  };

  const handleSubmit = async () => {
    const { phone_no, full_name, house_building_name, street_area } = formData;

    if (!full_name || !phone_no || !house_building_name || !street_area) {
      alert("❌ Please fill all the required fields before saving.");
      return;
    }

    if (!/^\d{10}$/.test(phone_no)) {
      alert("❌ Please enter a valid 10-digit mobile number.");
      return;
    }

    const token = localStorage.getItem('token');
    const method = editing ? 'PUT' : 'POST';
    const url = editing
      ? `http://localhost:5000/api/address/${editing._id}`
      : `http://localhost:5000/api/address`;

    try {
      const geoData = await fetchCoordinatesWithFallback(formData.locality, formData.city, formData.state, formData.pincode);
      if (!geoData) {
        alert("❌ Invalid address. Could not get exact coordinates.");
        return;
      }

      const latitude = geoData.lat;
      const longitude = geoData.lon;

      const storeRes = await fetch("http://localhost:5000/admin/get-store");
      const store = await storeRes.json();
      const storeLat = parseFloat(store.latitude);
      const storeLng = parseFloat(store.longitude);
      const deliveryRadius = parseFloat(store.deliveryRadius);

      const userLat = parseFloat(latitude);
      const userLng = parseFloat(longitude);

      const toRad = (val) => (val * Math.PI) / 180;
      const R = 6371;
      const dLat = toRad(storeLat - userLat);
      const dLon = toRad(storeLng - userLng);
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(userLat)) * Math.cos(toRad(storeLat)) * Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      if (distance > deliveryRadius) {
        alert(`❌ Address is outside the delivery area (~${distance.toFixed(2)} km).`);
        return;
      }

      const dataToSend = { ...formData, latitude, longitude };

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
        setSavedAddresses(prev => prev.map(a => (a._id === editing._id ? data.data || data : a)));
      } else {
        setSavedAddresses(prev => [...prev, data.data || data]);
      }

      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error('Error saving address:', err);
      alert("❌ Could not validate or save the address.");
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

  return (
    <div className="address-container">
      {!showForm ? (
        <>
          <div className="address-header">
            <h2>📬 Your Saved Addresses</h2>
            <div>
              <button className="primary" onClick={() => setShowForm(true)}>➕ Add New</button>
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
                  <p>{address.house_building_name}, {address.street_area},<br />{address.city}, {address.locality && <>{address.locality}, </>}{address.state} - {address.pincode}</p>
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
            <div className="pincode-check">
              <input name="pincode" placeholder="Enter Pincode" value={formData.pincode} onChange={handleChange} />
              <input name="city" placeholder="Enter City" value={formData.city} onChange={handleChange} />
              <input name="locality" placeholder="Enter Locality" value={formData.locality} onChange={handleChange} />
              <input name="state" placeholder="Enter State" value={formData.state} onChange={handleChange} />
              <button className="autofill-btn" onClick={checkPincodeRadius}>🚚 Check Delivery Availability</button>
            </div>
          ) : (
            <>
              <div className="form-grid">
                <input name="full_name" placeholder="Full Name" value={formData.full_name} onChange={handleChange} />
                <input name="phone_no" placeholder="Phone Number" value={formData.phone_no} onChange={handleChange} />
                <input name="house_building_name" placeholder="House/Building Name" value={formData.house_building_name} onChange={handleChange} />
                <input name="street_area" placeholder="Street/Area" value={formData.street_area} onChange={handleChange} />
                <input name="landmark" placeholder="Landmark (Optional)" value={formData.landmark} onChange={handleChange} />
                <input name="locality" placeholder="Locality" value={formData.locality} disabled />
                <input name="city" placeholder="City" value={formData.city} disabled />
                <input name="state" placeholder="State" value={formData.state} disabled />
                <input name="pincode" placeholder="Pincode" value={formData.pincode} disabled />
              </div>
              <div className="form-actions">
                <button className="success" onClick={handleSubmit}>{editing ? 'Update Address' : 'Save Address'}</button>
                <button className="secondary" onClick={() => { resetForm(); setShowForm(false); }}>Cancel</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <div onClick={() => navigate('/home')} className="nav-item">
          <FaHome size={20} />
          <span>Home</span>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAddress;
