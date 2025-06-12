// CheckDeliveryLocation.jsx
import React, { useState } from 'react';

const CheckDeliveryLocation = () => {
  const [form, setForm] = useState({
    house: '', street: '', city: '', state: '', pincode: ''
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toRad = (value) => (value * Math.PI) / 180;

  const checkAddress = async () => {
    const { house, street, city, state, pincode } = form;
    const query = `${house}, ${street}, ${city}, ${state}, ${pincode}`;
    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
    const geoData = await geoRes.json();

    if (geoData.length === 0) return alert('Address not found.');

    const userLat = parseFloat(geoData[0].lat);
    const userLng = parseFloat(geoData[0].lon);

    const storeRes = await fetch('http://localhost:5000/admin/get-store');
    const store = await storeRes.json();
    const storeLat = store.latitude;
    const storeLng = store.longitude;
    const deliveryRadius = store.deliveryRadius;

    const R = 6371;
    const dLat = toRad(storeLat - userLat);
    const dLon = toRad(storeLng - userLng);
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(userLat)) * Math.cos(toRad(storeLat)) *
              Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    if (distance <= deliveryRadius) {
      alert(`Address is within delivery area (~${distance.toFixed(2)} km)`);
    } else {
      alert(`Address is outside delivery area (~${distance.toFixed(2)} km)`);
    }
  };

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(async pos => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      const storeRes = await fetch('http://localhost:5000/admin/get-store');
      const store = await storeRes.json();

      const storeLat = store.latitude;
      const storeLng = store.longitude;
      const deliveryRadius = store.deliveryRadius;

      const dLat = toRad(storeLat - lat);
      const dLon = toRad(storeLng - lon);
      const a = Math.sin(dLat / 2) ** 2 +
                Math.cos(toRad(lat)) * Math.cos(toRad(storeLat)) *
                Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = 6371 * c;

      if (distance <= deliveryRadius) {
        alert(`You are within delivery area (~${distance.toFixed(2)} km)`);
      } else {
        alert(`You're outside delivery area (~${distance.toFixed(2)} km)`);
      }
    });
  };

  return (
    <div className="check-delivery-page">
      <h2>Check Delivery Area</h2>
      <input name="house" placeholder="House/Building" onChange={handleChange} />
      <input name="street" placeholder="Street/Area" onChange={handleChange} />
      <input name="city" placeholder="City" onChange={handleChange} />
      <input name="state" placeholder="State" onChange={handleChange} />
      <input name="pincode" placeholder="Pincode" onChange={handleChange} />
      <button onClick={checkAddress}>✅ Check This Address</button>
      <hr />
      <button onClick={getCurrentLocation}>📍 Use My Current Location</button>
    </div>
  );
};

export default CheckDeliveryLocation;
