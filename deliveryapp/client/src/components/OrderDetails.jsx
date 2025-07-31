import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHome } from 'react-icons/fa';
import './OrderDetails.css';

const OrderDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;

  if (!order) return <div className="error">⚠️ No order data found.</div>;

  const steps = [
    'Waiting for Acceptance',
    'Ready for Assembly',
    'In Packing',
    'Ready for Delivery',
    'Delivery in-progress',
    'Delivered',
    'Completed'
  ];

  const currentIndex = steps.indexOf(order.orderStatus);
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;

  const calculateTotal = (items) =>
    items.reduce(
      (sum, item) =>
        sum + ((item.Price || 0) * (item.quantity ?? 1)),
      0
    );

  return (
    <div className="order-details-page">
      <div className="nav-buttons">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <button className="home-button" onClick={() => navigate('/home')}>
          <FaHome /> Home
        </button>
      </div>

      <h2>Order Details</h2>
      <p><strong>Order ID:</strong> {order._id}</p>
      <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>

      <div className="items-section">
        <h3>Items</h3>
        {order.items.map((item, idx) => (
          <div key={idx} className="item">
            <img
              src={item.image || '/no-image.png'}
              alt={item.ProductName || 'Product'}
              className="item-img"
            />
            <div className="item-info">
              <strong>{item.ProductName}</strong>
              <p>Qty: {item.quantity ?? 'N/A'}</p>
              <p>Price: ₹{(item.Price ?? 0).toFixed(2)}</p>
              <p>Status: {item.status || 'Pending'}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="total">
        <p><strong>Subtotal:</strong> ₹{(order.totalPrice ?? calculateTotal(order.items)).toFixed(2)}</p>
        <p><strong>GST:</strong> ₹{(order.gst ?? 0).toFixed(2)}</p>
        <p><strong>Grand Total:</strong> ₹
          {(order.grandTotal ?? calculateTotal(order.items)).toFixed(2)}
        </p>
      </div>

      {order.assignedAgent?.name && (
        <div className="agent-info">
          <strong>🚚 Agent:</strong> {order.assignedAgent.name}
        </div>
      )}

      <div className="tracker">
        {steps.map((step, idx) => {
          const stepClass =
            idx < safeIndex
              ? 'completed'
              : idx === safeIndex
              ? 'current'
              : 'upcoming';

          return (
            <div key={idx} className={`step ${stepClass}`}>
              <div className="circle" />
              <span>{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderDetails;
