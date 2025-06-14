import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineHome } from 'react-icons/ai'; // 👈 import home icon
import './OrderSuccess.css';

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="order-success-page">
      <h1>🎉 Order Placed Successfully!</h1>
      <p>Thank you for shopping with <strong>DatCarts Delivery App</strong>.</p>
      <p>Your payment has been received and your order is being processed.</p>

      <button className="success-home-btn" onClick={() => navigate('/home')}>
        <AiOutlineHome size={24} style={{ marginRight: '6px' }} />
        {/* Optional text beside icon */}
        {/* <span>Home</span> */}
      </button>
    </div>
  );
};

export default OrderSuccess;
