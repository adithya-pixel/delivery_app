import React, { useState } from 'react';
import './Home.css';
import {
  FaSearch,
  FaShoppingCart,
  FaHome,
  FaThLarge,
  FaClipboardList,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const allProducts = [
  { id: 1, name: 'Banana', qty: '500g', price: 45, img: '🍌', inStock: true, category: 'Fruits' },
  { id: 2, name: 'Milk', qty: '500ml', price: 25, img: '🥛', inStock: true, category: 'Dairy' },
  { id: 3, name: 'Chips', qty: '200g', price: 30, img: '🍟', inStock: true, category: 'Snacks' },
  { id: 4, name: 'Bread', qty: '1 loaf', price: 35, img: '🍞', inStock: true, category: 'Bakery' },
];

const categories = ['All', 'Fruits', 'Dairy', 'Snacks', 'Bakery'];

const Home = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleAddToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  const filteredProducts = selectedCategory === 'All'
    ? allProducts
    : allProducts.filter(p => p.category === selectedCategory);

  const goToProductDetails = (product) => {
    navigate(`/product/${product.id}`, { state: product });
  };

  return (
    <div className="home-container">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="search-container">
          <FaSearch className="top-icon" />
          <input
            type="text"
            className="search-bar"
            placeholder="Search Product"
          />
        </div>
        <div className="icon-group">
          <FaClipboardList className="top-icon" onClick={() => navigate('/order')} />
          <div className="cart-icon-wrapper">
            <FaShoppingCart className="top-icon" onClick={() => navigate('/cart')} />
            {cart.length > 0 && (
              <span className="cart-badge">{cart.length}</span>
            )}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="categories">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product List */}
      <div className="product-list">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => goToProductDetails(product)}
          >
            <div className="product-img">{product.img}</div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p>{product.qty}</p>
              <p>₹{product.price}</p>
            </div>
            <button
              className="add-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(product);
              }}
            >
              Add
            </button>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <div className="nav-item" onClick={() => navigate('/home')}>
          <FaHome />
          <p>Home</p>
        </div>
        <div className="nav-item" onClick={() => navigate('/category')}>
          <FaThLarge />
          <p>Category</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
