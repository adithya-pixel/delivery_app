// src/OrderPage.jsx
import React, { useEffect, useState } from 'react';
import './Order.css';
import { FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await axios.get('http://localhost:5000/api/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('❌ Error fetching orders:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleOrder = (id) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  const getStatusClass = (status) => {
    if (status === 'Delivered') return 'badge delivered';
    if (status === 'On process') return 'badge processing';
    if (status === 'Order Cancelled') return 'badge cancelled';
    return 'badge pending';
  };

  const calculateTotal = (items) =>
    items.reduce((sum, item) => sum + (item.Price || 0), 0);

  const filteredOrders = orders.filter((order) => {
    const lowerSearch = searchQuery.toLowerCase();
    const orderDate = new Date(order.createdAt);

    const formats = [
      orderDate.toLocaleDateString(), // 6/14/2025
      orderDate.toLocaleDateString('en-GB'), // 14/06/2025
      orderDate.toDateString().toLowerCase(), // sat jun 14 2025
      orderDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toLowerCase(), // 14 Jun 2025
    ];

    return formats.some((format) => format.includes(lowerSearch));
  });

  return (
    <div className="order-container">
      <h2 className="order-title">🧾 My Orders</h2>
      <input
        className="search-box"
        placeholder="🔍 Search by date (e.g., 14 Jun, 14/6/2025)"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
      />

      {loading ? (
        <p className="order-message">Loading your orders...</p>
      ) : orders.length === 0 ? (
        <p className="order-message">You haven't placed any orders yet.</p>
      ) : filteredOrders.length === 0 ? (
        <p className="order-message">🔍 No orders found for this date.</p>
      ) : (
        filteredOrders.map((order, index) => (
          <div
            key={order._id}
            className="order-card"
            onClick={() => toggleOrder(order._id)}
          >
            <div className="order-summary">
              <div>
                <h3 className="order-id">Order #{index + 1}</h3>
                <p className="order-date">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <div className={getStatusClass(order.paymentStatus)}>
                {order.paymentStatus}
              </div>
            </div>

            {expandedOrderId === order._id && (
              <div className="order-details">
                {order.items.map((item, i) => (
                  <div key={i} className="product-item">
                    <img
                      src={item.image || '/no-image.png'}
                      alt={item.ProductName || 'Product'}
                      className="product-img"
                    />
                    <div className="product-info">
                      <strong>{item.ProductName || 'Unnamed Product'}</strong>
                      <p>₹ {item.Price || 0}</p>
                      <p>Qty: {item.quantity || 1}</p>
                    </div>
                  </div>
                ))}
                <div className="total-amount">
                  <strong>
                    Grand Total: ₹{' '}
                    {order.grandTotal
                      ? parseFloat(order.grandTotal).toFixed(2)
                      : calculateTotal(order.items).toFixed(2)}
                  </strong>
                </div>
              </div>
            )}
          </div>
        ))
      )}

      <div className="bottom-nav">
        <div className="nav-item" onClick={() => navigate('/home')}>
          <FaHome size={24} />
          <p>Home</p>
        </div>
      </div>
    </div>
  );
}

export default OrderPage;
