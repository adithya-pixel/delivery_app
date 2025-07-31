import React, { useEffect, useState } from 'react';
import './Order.css';
import { FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [storeSettings, setStoreSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const navigate = useNavigate();

  useEffect(() => {
    getOrders();
    getStoreSettings();
  }, []);

  const getOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return setLoading(false);

      const res = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(res.data.orders || []);
    } catch (error) {
      console.error('❌ Error fetching orders:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStoreSettings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/settings');
      setStoreSettings(res.data);
    } catch (error) {
      console.error('❌ Error fetching settings:', error.message);
    }
  };

  const calculateTotal = (items) =>
    items.reduce((sum, item) => sum + (item.Price || 0), 0);

  const filteredOrders = orders.filter((order) => {
    const search = searchQuery.toLowerCase();
    const date = new Date(order.createdAt);
    const formats = [
      date.toLocaleDateString(),
      date.toLocaleDateString('en-GB'),
      date.toDateString().toLowerCase(),
      date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toLowerCase(),
    ];
    return formats.some((f) => f.includes(search));
  });

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  useEffect(() => {
    setCurrentPage(1); // reset to page 1 on search change
  }, [searchQuery]);

  return (
    <div className="order-page-container">
      {/* ✅ Store Header */}
      {storeSettings && (
        <div className="order-page-header">
          {storeSettings.logoUrl ? (
            <img
              src={storeSettings.logoUrl}
              alt="Store Logo"
              className="order-page-logo"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <p className="order-page-no-logo">No logo available</p>
          )}

          <div className="order-page-info">
            <div className="order-page-marquee">
              <span className="order-page-name">{storeSettings.storeName}</span>
              <span className="order-page-address">📍 {storeSettings.address}</span>
              <span className="order-page-hours">🕒 {storeSettings.workingHours}</span>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Title */}
      <h2 className="order-page-title">📦 My Orders</h2>

      {/* ✅ Search */}
      <input
        className="order-page-search"
        placeholder="🔍 Search by date (e.g., 14 Jun, 14/6/2025)"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* ✅ Orders List */}
      {loading ? (
        <p className="order-page-message">Loading your orders...</p>
      ) : paginatedOrders.length === 0 ? (
        <p className="order-page-message">
          {orders.length === 0
            ? "You haven't placed any orders yet."
            : '🔍 No orders found for this date.'}
        </p>
      ) : (
        paginatedOrders.map((order, index) => (
          <div
            key={order._id}
            className="order-page-card"
            onClick={() => navigate(`/order/${order._id}`, { state: { order } })}
          >
            <div className="order-page-summary">
              <div>
                <h3 className="order-page-id">Order #{(currentPage - 1) * ordersPerPage + index + 1}</h3>
                <p className="order-page-date">{new Date(order.createdAt).toLocaleString()}</p>
                <p className="order-page-status">
                  📌 <strong>Status:</strong> {order.orderStatus || 'Pending'}
                </p>
              </div>
              <div className="order-page-total">
                ₹{' '}
                {(order.grandTotal
                  ? parseFloat(order.grandTotal)
                  : calculateTotal(order.items)
                ).toFixed(2)}
              </div>
            </div>
          </div>
        ))
      )}

      {/* ✅ Pagination Controls */}
      {filteredOrders.length > ordersPerPage && (
        <div className="order-page-pagination">
          <button
            className="order-page-page-btn"
            disabled={currentPage === 1}
            onClick={() => handlePageChange('prev')}
          >
            ⬅ Prev
          </button>
          <span className="order-page-page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="order-page-page-btn"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange('next')}
          >
            Next ➡
          </button>
        </div>
      )}

      {/* ✅ Bottom Navigation */}
      <div className="order-page-bottom-nav">
        <div className="order-page-nav-item" onClick={() => navigate('/home')}>
          <FaHome size={24} />
          <p>Home</p>
        </div>
      </div>
    </div>
  );
}

export default OrderPage;
