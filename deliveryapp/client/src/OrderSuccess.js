import React from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderSuccess.css'; 

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="order-success-page">
      <h1>🎉 Order Placed Successfully!</h1>
      <p>Thank you for shopping with <strong>DatCarts Delivery App</strong>.</p>
      <p>Your payment has been received and your order is being processed.</p>

      <button className="success-home-btn" onClick={() => navigate('/home')}>
        Back to Home
      </button>
    </div>
  );
};

export default OrderSuccess;
