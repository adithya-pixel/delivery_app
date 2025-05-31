import React, { useState } from 'react';
import './Order.css';

const orders = [
  {
    id: 1,
    status: 'On process',
    date: 'Tue, 25 Mar',
    products: [
      { name: 'Banana', qty: '500g', emoji: '🍌', price: 30 },
      { name: 'Apple', qty: '1kg', emoji: '🍎', price: 120 }
    ],
  },
  {
    id: 2,
    status: 'Delivered',
    date: 'Mon, 24 March',
    products: [
      { name: 'Milk', qty: '500ml', emoji: '🥛', price: 25 },
      { name: 'Bread', qty: '1 pack', emoji: '🍞', price: 40 },
    ],
    rating: 5,
    feedback: true,
  },
  {
    id: 3,
    status: 'Order Cancelled',
    date: 'Wed, 20 Jan',
    products: [
      { name: 'Chocolate', qty: '1', emoji: '🍫', price: 60 }
    ],
  },
];

function Order() {
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const toggleOrder = (id) => {
    setExpandedOrderId(prev => (prev === id ? null : id));
  };

  const calculateTotal = (products) => {
    return products.reduce((total, item) => total + item.price, 0);
  };

  const getStatusClass = (status) => {
    if (status === 'Delivered') return 'badge delivered';
    if (status === 'On process') return 'badge processing';
    if (status === 'Order Cancelled') return 'badge cancelled';
  };

  return (
    <div className="container">
      <h2>🛒 My Orders</h2>
      <input className="search-box" placeholder="🔍 Search your orders" />

      {orders.map((order) => (
        <div key={order.id} className="order-card" onClick={() => toggleOrder(order.id)}>
          <div className="order-summary">
            <div>
              <h3>Order #{order.id}</h3>
              <small>{order.date}</small>
            </div>
            <div className={getStatusClass(order.status)}>{order.status}</div>
          </div>

          {expandedOrderId === order.id && (
            <div className="order-details">
              {order.products.map((product, idx) => (
                <div key={idx} className="product-item">
                  <span className="product-emoji">{product.emoji}</span>
                  <div className="product-info">
                    <strong>{product.name}</strong>
                    <p>Qty: {product.qty}</p>
                    <p>₹ {product.price}</p>
                  </div>
                </div>
              ))}

              <div className="total-amount">
                <strong>Total Amount: ₹ {calculateTotal(order.products)}</strong>
              </div>

              {order.feedback && (
                <div className="order-feedback">
                  <div>⭐️⭐️⭐️⭐️⭐️</div>
                  <button>Add Feedback</button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Order;
