import React, { useState } from 'react';
import './cart.css'; // Styles including bottom nav and footer
import { FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const navigate = useNavigate();

  // Load cart from localStorage or empty array initially
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Update quantity of a product by amount (+1 or -1)
  const updateQuantity = (barcode, amount) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.Barcode === barcode
          ? { ...item, quantity: Math.max(1, (item.quantity || 1) + amount) }
          : item
      );
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  // Remove item by barcode
  const removeItem = (barcode) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.Barcode !== barcode);
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  // Calculate totals
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.Price * (item.quantity || 1),
    0
  );
  const gst = 0; // GST is now 0%
  const grandTotal = totalPrice + gst;

  // 🔻 Handle Razorpay Payment
  const handlePayment = async () => {
    const options = {
      key: 'YOUR_RAZORPAY_KEY_ID', // 🔁 Replace with your real Razorpay Key ID
      amount: grandTotal * 100, // Amount in paise
      currency: 'INR',
      name: 'DatCarts Delivery',
      description: 'Order Payment',
      handler: function (response) {
        alert('✅ Payment successful!\nPayment ID: ' + response.razorpay_payment_id);
        localStorage.removeItem('cart');
        navigate('/order-success');
      },
      prefill: {
        name: 'Customer Name',
        email: 'customer@example.com',
        contact: '9999999999',
      },
      theme: {
        color: '#0ea5e9',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="cart-page">
      {/* Header */}
      <header className="cart-header">Your Cart</header>

      {/* Body */}
      <div className="cart-container">
        <div>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div className="cart-item" key={item.Barcode}>
                <img src={item.image || 'placeholder.png'} alt={item.ProductName} />
                <div style={{ flex: 1 }}>
                  <h2>{item.ProductName}</h2>
                  <p>Price: ₹{item.Price}</p>
                  <div>
                    <button onClick={() => updateQuantity(item.Barcode, -1)}>-</button>
                    <span style={{ margin: '0 10px' }}>{item.quantity || 1}</span>
                    <button onClick={() => updateQuantity(item.Barcode, 1)}>+</button>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.Barcode)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        {/* Price details */}
        <div className="price-details">
          <h3>Price Details</h3>
          <p>Total: ₹{totalPrice.toFixed(2)}</p>
          <p>GST (0%): ₹{gst.toFixed(2)}</p>
          <p>
            <strong>Grand Total: ₹{grandTotal.toFixed(2)}</strong>
          </p>
          <button
            className="place-order-btn"
            onClick={handlePayment}
            disabled={cartItems.length === 0}
          >
            Place Order
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <div className="nav-item" onClick={() => navigate('/home')}>
          <FaHome size={24} />
          <p>Home</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="cart-footer">
        &copy; {new Date().getFullYear()} DatCarts Delivery App.
      </footer>
    </div>
  );
};

export default CartPage;
