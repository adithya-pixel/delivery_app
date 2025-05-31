import React, { useState } from 'react';
import './cart.css'; // Optional styling

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Pizza", price: 200, quantity: 1, image: "" },
    { id: 2, name: "Burger", price: 100, quantity: 1, image: "" },
  ]);

  const updateQuantity = (id, amount) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const gst = totalPrice * 0.05;
  const grandTotal = totalPrice + gst;

  return (
    
    <div className="cart-page">
      {/* Header */}
      <header className="cart-header">
        Your Cart
      </header>

      {/* Body */}
      <div className="cart-container">
        <div>
          {cartItems.map(item => (
            <div className="cart-item" key={item.id}>
              <img src={item.image} alt={item.name} />
              <div style={{ flex: 1 }}>
                <h2>{item.name}</h2>
                <p>Price: ₹{item.price}</p>
                <div>
                  <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                  <span style={{ margin: "0 10px" }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                </div>
              </div>
              <button onClick={() => removeItem(item.id)} style={{ color: "red", marginLeft: "10px" }}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="price-details">
          <h3>Price Details</h3>
          <p>Total: ₹{totalPrice.toFixed(2)}</p>
          <p>GST (5%): ₹{gst.toFixed(2)}</p>
          <p><strong>Grand Total: ₹{grandTotal.toFixed(2)}</strong></p>
          <button className="place-order-btn">Place Order</button>
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
