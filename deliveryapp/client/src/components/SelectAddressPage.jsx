import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SelectAddressPage.css';
import { FaHome, FaMapMarkerAlt, FaEdit, FaCheck, FaPlus } from 'react-icons/fa';

const SelectAddressPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const totalPrice = location.state?.totalPrice || 0;
  const gst = location.state?.gst || 0;
  const grandTotal = location.state?.grandTotal || 0;

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAllAddresses, setShowAllAddresses] = useState(false);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
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

    const orderData = await orderRes.json();
    const newOrder = orderData.order || orderData;

    alert('✅ Order placed successfully!');
    localStorage.removeItem('cart');

    // ✅ Navigate to order detail page instead of generic success
    navigate(`/order/${newOrder._id}`, { state: { order: newOrder } });

  } catch (err) {
    console.error('❌ Order failed:', err);
    alert('❌ Order placement failed.');
  }
};

  const defaultAddress = savedAddresses.find((a) => a.isDefault);
  const otherAddresses = savedAddresses.filter((a) => !a.isDefault);

  if (loading) {
    return (
      <div className="select-address-container">
        
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading addresses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="select-address-container">
      
      <header className="page-header">
           <div className="back-button" onClick={() => navigate('/cart')}>
    ⬅️ Back
  </div>
        <div className="header-content">
          
          <FaMapMarkerAlt className="header-icon" />
          <h1 className="page-title">Choose Delivery Address</h1>
        </div>
      </header>

      <div className="address-section">
        {defaultAddress ? (
          <div className="address-card default-address fade-in">
            <div className="address-header">
              <div className="address-badge">
                <FaCheck className="badge-icon" />
                <span>Default Address</span>
              </div>
              <input
                type="radio"
                name="selectedAddress"
                value={defaultAddress._id}
                checked={selectedAddressId === defaultAddress._id}
                onChange={() => setSelectedAddressId(defaultAddress._id)}
                className="address-radio"
              />
            </div>
            <div className="address-content">
              <h3 className="recipient-name">{defaultAddress.full_name}</h3>
              <div className="address-details">
                <p>{defaultAddress.house_building_name}, {defaultAddress.street_area}</p>
                <p>{defaultAddress.locality}, {defaultAddress.city} - {defaultAddress.pincode}</p>
                <p className="address-line state">{defaultAddress.state}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-address-message">
            <FaMapMarkerAlt className="no-address-icon" />
            <p>No default address found</p>
          </div>
        )}

        {!showAllAddresses && otherAddresses.length > 0 && (
          <button
            className="show-more-button"
            onClick={() => setShowAllAddresses(true)}
          >
            <FaPlus className="button-icon" />
            Show {otherAddresses.length} Other Address{otherAddresses.length > 1 ? 'es' : ''}
          </button>
        )}

        {showAllAddresses && otherAddresses.length > 0 && (
          <div className="other-addresses">
            <h2 className="section-title">Other Addresses</h2>
            <div className="address-grid">
              {otherAddresses.map((address) => (
                <div
                  key={address._id}
                  className={`address-card fade-in ${selectedAddressId === address._id ? 'selected' : ''}`}
                >
                  <div className="address-header">
                    <input
                      type="radio"
                      name="selectedAddress"
                      value={address._id}
                      checked={selectedAddressId === address._id}
                      onChange={() => setSelectedAddressId(address._id)}
                      className="address-radio"
                    />
                  </div>
                  <div className="address-content">
                    <h3 className="recipient-name">{address.full_name}</h3>
                    <div className="address-details">
                      <p>{address.house_building_name}, {address.street_area}</p>
                      <p>{address.locality}, {address.city} - {address.pincode}</p>
                      <p className="address-line state">{address.state}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="order-summary">
        <h3 className="summary-title">Order Summary</h3>
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>₹{totalPrice.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>GST:</span>
          <span>₹{gst.toFixed(2)}</span>
        </div>
        <hr className="summary-divider" />
        <div className="summary-row total">
          <span>Total:</span>
          <span>₹{grandTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="action-section">
        <button
          className="manage-address-button"
          onClick={() => navigate('/DeliveryAddress')}
        >
          <FaEdit className="button-icon" />
          Manage Addresses
        </button>

        <button
          className="place-order-button"
          onClick={handlePlaceOrder}
          disabled={!selectedAddressId}
        >
          Place Order - ₹{grandTotal.toFixed(2)}
        </button>
      </div>

      <nav className="bottom-navigation">
        <div
          onClick={() => navigate('/home')}
          className="nav-item"
        >
          <FaHome className="nav-icon" />
          <span className="nav-label">Home</span>
        </div>
      </nav>
    </div>
  );
};

export default SelectAddressPage;
