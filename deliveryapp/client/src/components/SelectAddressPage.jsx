import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SelectAddressPage.css';

const SelectAddressPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const totalPrice = location.state?.totalPrice || 0;
  const gst = location.state?.gst || 0;
  const grandTotal = location.state?.grandTotal || 0;

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:5000/api/address', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (data.success === false) throw new Error(data.message);
        setSavedAddresses(data.data || data);
      } catch (error) {
        console.error('❌ Failed to fetch addresses:', error.message);
        alert('❌ Could not load your saved addresses.');
      }
    };
    fetchAddresses();
  }, []);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert('❗ Please select a delivery address.');
      return;
    }

    const address = savedAddresses.find((a) => a._id === selectedAddressId);
    const userLat = parseFloat(address?.latitude);
    const userLng = parseFloat(address?.longitude);

    if (!userLat || !userLng || isNaN(userLat) || isNaN(userLng)) {
      alert('❌ Selected address has invalid coordinates.');
      return;
    }

    try {
      const storeRes = await fetch('http://localhost:5000/admin/get-store');
      const store = await storeRes.json();

      const { latitude: storeLat, longitude: storeLng, deliveryRadius } = store;
      const toRad = (val) => (val * Math.PI) / 180;
      const R = 6371;

      const dLat = toRad(storeLat - userLat);
      const dLon = toRad(storeLng - userLng);

      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(userLat)) * Math.cos(toRad(storeLat)) * Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      if (distance > deliveryRadius) {
        alert(`❌ Address is outside delivery area (~${distance.toFixed(2)} km)`);
        return;
      }

      // ✅ Proceed to save order
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const cart = JSON.parse(localStorage.getItem('cart')) || [];

      const orderPayload = {
        user: userId,
        addressId: selectedAddressId,
        items: cart,
        totalPrice,
        gst,
        grandTotal,
        paymentStatus: 'Pending',
      };

      const orderRes = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      if (!orderRes.ok) throw new Error('Order creation failed');

      alert('✅ Order placed successfully!');
      localStorage.removeItem('cart');
      navigate('/order-success');
    } catch (err) {
      console.error('❌ Order failed:', err);
      alert('❌ Order placement failed.');
    }
  };

  return (
    <div className="select-address-container">
      <h2 className="heading">Select Delivery Address</h2>

      {savedAddresses.length === 0 ? (
        <p className="no-address-msg">No saved addresses available.</p>
      ) : (
        savedAddresses.map((address) => (
          <div key={address._id} className="address-item">
            <input
              type="radio"
              name="selectedAddress"
              value={address._id}
              onChange={() => setSelectedAddressId(address._id)}
            />
            <label>
              <strong>{address.full_name}</strong>, {address.house_building_name}, {address.street_area},<br />
              {address.locality}, {address.city} - {address.pincode}, {address.state}
            </label>
          </div>
        ))
      )}

      <div className="manage-address-info">
        <p className="manage-msg">Want to add or edit addresses?</p>
        <button className="manage-address-btn" onClick={() => navigate('/DeliveryAddress')}>
          ➕ Manage Address
        </button>
      </div>

      <button className="pay-button" onClick={handlePlaceOrder}>
        Place Order ₹{grandTotal.toFixed(2)}
      </button>
    </div>
  );
};

export default SelectAddressPage;
