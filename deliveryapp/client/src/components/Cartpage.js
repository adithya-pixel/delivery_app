import React, { useState } from 'react';
import './cart.css';
import { FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

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

  const removeItem = (barcode) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.Barcode !== barcode);
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.Price * (item.quantity || 1),
    0
  );

  const gstRate = 0; // ✅ GST set to 0%
  const gst = totalPrice * gstRate;
  const grandTotal = totalPrice + gst;

  const goToAddressPage = () => {
    if (cartItems.length === 0) return;
    navigate('/select-address', {
      state: { grandTotal, gst, totalPrice },
    });
  };

  return (
    <div className="cart-page">
      <header className="cart-header">Your Cart</header>

      <div className="cart-container">
        {/* 🛍️ Left Side - Cart Items */}
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p className="empty-cart">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div className="cart-item" key={item.Barcode}>
                <img
                  src={item.image || 'placeholder.png'}
                  alt={item.ProductName}
                />
                <div className="cart-item-details">
                  <h2 className="cart-item-title">{item.ProductName}</h2>
                  <p className="cart-item-price">₹{item.Price}</p>
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.Barcode, -1)}>-</button>
                    <span>{item.quantity || 1}</span>
                    <button onClick={() => updateQuantity(item.Barcode, 1)}>+</button>
                  </div>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.Barcode)}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        {/* 💰 Right Side - Price Details */}
        <div className="price-details">
          <h3>Price Details</h3>
          <p>Total: ₹{totalPrice.toFixed(2)}</p>
          <p>GST (0%): ₹{gst.toFixed(2)}</p>
          <p className="total">Grand Total: ₹{grandTotal.toFixed(2)}</p>
          <button
            className="place-order-btn"
            onClick={goToAddressPage}
            disabled={cartItems.length === 0}
          >
            Place Order
          </button>
        </div>
      </div>

      {/* 🚀 Bottom Navigation */}
      <div className="bottom-nav">
        <div className="nav-item" onClick={() => navigate('/home')}>
          <FaHome size={22} />
          <p>Home</p>
        </div>
      </div>

      <footer className="cart-footer">
        &copy; {new Date().getFullYear()} DatCarts Delivery App.
      </footer>
    </div>
  );
};

export default CartPage;
