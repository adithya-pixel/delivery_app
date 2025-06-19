import React, { useState, useEffect } from 'react';
import './Home.css';
import {
  FaSearch,
  FaShoppingCart,
  FaHome,
  FaClipboardList,
  FaUser,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const categories = ['All', 'Dishwash', 'Home Fragrance', 'Floor Cleaner', 'Toilet Cleaner'];

const Home = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  // ✅ Check for token
  useEffect(() => {
   const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // ✅ Sync cart from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  // ✅ Fetch Products
  useEffect(() => {
    const categoryQuery = selectedCategory !== 'All' ? `&category=${encodeURIComponent(selectedCategory)}` : '';
    const searchQuery = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : '';
    const token = sessionStorage.getItem('token');

    fetch(`http://localhost:5000/api/products?page=${page}&limit=${limit}${categoryQuery}${searchQuery}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then((data) => {
        setProducts(data.products);
        setTotalPages(data.totalPages);
      })
      .catch((err) => console.error('Fetch error:', err));
  }, [page, selectedCategory, searchTerm]);

  const handleAddToCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    if (existingCart.find((p) => p.Barcode === product.Barcode)) return;

    const updatedCart = [...existingCart, product];
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const goToProductDetails = (product) => {
    navigate(`/product/${product.Barcode}`, { state: { product } });
  };

  return (
    <div className="home-container" style={{ paddingBottom: 60 }}>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="search-container">
          <FaSearch className="top-icon" />
          <input
            type="text"
            className="search-bar"
            placeholder="Search Product"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="icon-group">
          <FaClipboardList
            className="top-icon"
            onClick={() => navigate('/order')}
            style={{ cursor: 'pointer' }}
            title="View Orders"
          />
          <div
            className="cart-icon-wrapper"
            onClick={() => navigate('/cart')}
            style={{ cursor: 'pointer' }}
            title="View Cart"
          >
            <FaShoppingCart className="top-icon" />
            {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="categories">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => {
              setSelectedCategory(cat);
              setPage(1);
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product List */}
      <div className="product-list">
        {products.length === 0 ? (
          <p className="no-products-msg">No products found.</p>
        ) : (
          products.map((product) => (
            <div
              key={product.Barcode}
              className="product-card"
              onClick={() => goToProductDetails(product)}
            >
              <img
                src={
                  product.image && product.image.startsWith('http')
                    ? product.image
                    : product.image
                    ? `/${product.image}`
                    : 'placeholder.png'
                }
                alt={product.ProductName}
                className="product-img"
              />
              <div className="product-info">
                <h3>{product.ProductName}</h3>
                <p>{product.Quantity}</p>
                <p>Brand: {product.Brand}</p>
                <p className="product-price">₹ {product.Price}</p>
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
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={page <= 1}
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
        >
          Next
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <div onClick={() => navigate('/home')} className="nav-item">
          <FaHome />
          <span>Home</span>
        </div>
        <div onClick={() => navigate('/Customerprofile')} className="nav-item">
          <FaUser />
          <span>Profile</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
