// SelectAddressPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SelectAddressPage.css';
import { FaHome } from 'react-icons/fa';

const SelectAddressPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const totalPrice = location.state?.totalPrice || 0;
  const gst = location.state?.gst || 0;
  const grandTotal = location.state?.grandTotal || 0;

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAllAddresses, setShowAllAddresses] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:5000/api/address', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success === false) throw new Error(data.message);
        const addresses = data.data || data;
        setSavedAddresses(addresses);
        const defaultAddress = addresses.find((a) => a.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress._id);
        }
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
        Math.cos(toRad(userLat)) *
          Math.cos(toRad(storeLat)) *
          Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      if (distance > deliveryRadius) {
        alert(`❌ Address is outside delivery area (~${distance.toFixed(2)} km)`);
        return;
      }

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

  const defaultAddress = savedAddresses.find((a) => a.isDefault);
  const otherAddresses = savedAddresses.filter((a) => !a.isDefault);

  return (
    <div className="select-address-container">
      <h2 className="heading">Select Delivery Address</h2>

      {defaultAddress ? (
        <div className="address-item">
          <div className="address-details">
            <strong>{defaultAddress.full_name}</strong>
            <span className="default-label">✅ Default Address</span>
            <br />
            {defaultAddress.house_building_name}, {defaultAddress.street_area},<br />
            {defaultAddress.locality}, {defaultAddress.city} - {defaultAddress.pincode}, {defaultAddress.state}
          </div>
          <input
            type="radio"
            name="selectedAddress"
            value={defaultAddress._id}
            checked={selectedAddressId === defaultAddress._id}
            onChange={() => setSelectedAddressId(defaultAddress._id)}
          />
        </div>
      ) : (
        <p className="no-address-msg">No default address found.</p>
      )}

      {!showAllAddresses && otherAddresses.length > 0 && (
        <button className="show-more-btn" onClick={() => setShowAllAddresses(true)}>
          ➕ Choose Another Address
        </button>
      )}

      {showAllAddresses && (
        <div className="address-grid">
          {otherAddresses.map((address) => (
            <div key={address._id} className="address-item">
              <div className="address-details">
                <strong>{address.full_name}</strong><br />
                {address.house_building_name}, {address.street_area},<br />
                {address.locality}, {address.city} - {address.pincode}, {address.state}
              </div>
              <input
                type="radio"
                name="selectedAddress"
                value={address._id}
                checked={selectedAddressId === address._id}
                onChange={() => setSelectedAddressId(address._id)}
              />
            </div>
          ))}
        </div>
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

      <div className="bottom-nav">
        <div onClick={() => navigate('/home')} className="nav-item">
          <FaHome size={20} />
          <span>Home</span>
        </div>
      </div>
    </div>
  );
};

export default SelectAddressPage;
