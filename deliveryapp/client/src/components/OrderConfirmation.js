import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, totalPrice, gst, grandTotal, selectedAddress } = location.state || {};

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleConfirmOrder = () => {
    if (!selectedAddress) {
      alert('Please select a delivery address.');
      return;
    }

    alert('✅ Order placed successfully!');
    localStorage.removeItem('cart');
    navigate('/order-success');
  };

  return (
    <div className="order-page">
      <h1>Order Summary</h1>

      {/* Delivery Address Summary */}
      <div className="address-summary">
        <h2>Delivery Address</h2>
        {selectedAddress ? (
          <div>
            <p><strong>{selectedAddress.full_name}</strong> ({selectedAddress.phone_no})</p>
            <p>{selectedAddress.house_building_name}, {selectedAddress.street_area}</p>
            <p>{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}</p>
            {selectedAddress.landmark && <p>Landmark: {selectedAddress.landmark}</p>}
          </div>
        ) : (
          <div>
            <p>No address selected.</p>
            <button onClick={() => navigate('/DeliveryAddress', { state: { cartItems, totalPrice, gst, grandTotal } })}>
              Choose Delivery Address
            </button>
          </div>
        )}
      </div>

      {/* Cart Items */}
      <div className="order-items">
        <h2>Items in Your Order</h2>
        {cartItems?.map((item) => (
          <div className="order-item" key={item.Barcode}>
            <p>{item.ProductName} x {item.quantity || 1}</p>
            <p>₹{(item.Price * (item.quantity || 1)).toFixed(2)}</p>
          </div>
        ))}
      </div>

      {/* Price Summary */}
      <div className="order-price-summary">
        <h3>Price Details</h3>
        <p>Total: ₹{totalPrice?.toFixed(2)}</p>
        <p>GST: ₹{gst?.toFixed(2)}</p>
        <p><strong>Grand Total: ₹{grandTotal?.toFixed(2)}</strong></p>
      </div>

      {/* Confirm Button */}
      <button className="confirm-order-btn" onClick={handleConfirmOrder}>
        Confirm Order
      </button>
    </div>
  );
};

export default OrderConfirmation;
