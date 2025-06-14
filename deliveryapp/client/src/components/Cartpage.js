// CartPage.jsx
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
              <button className="remove-btn" onClick={() => removeItem(item.Barcode)}>
                Remove
              </button>
            </div>
          ))
        )}

        <div className="price-details">
          <h3>Price Details</h3>
          <p>Total: ₹{totalPrice.toFixed(2)}</p>
          <p>GST (0%): ₹{gst.toFixed(2)}</p>
          <p><strong>Grand Total: ₹{grandTotal.toFixed(2)}</strong></p>
          <button
            className="place-order-btn"
            onClick={goToAddressPage}
            disabled={cartItems.length === 0}
          >
            Place Order
          </button>
        </div>
      </div>

      <div className="bottom-nav">
        <div className="nav-item" onClick={() => navigate('/home')}>
          <FaHome size={24} />
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
