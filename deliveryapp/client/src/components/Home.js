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

// ✅ Debounce utility
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

const categories = ['All', 'Dishwash', 'Home Fragrance', 'Floor Cleaner', 'Toilet Cleaner'];

const Home = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500); // ⏱️ Debounce added
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [storeSettings, setStoreSettings] = useState(null);
  const limit = 5;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  // ✅ FETCH with debounced searchTerm
  useEffect(() => {
    const categoryQuery = selectedCategory !== 'All' ? `&category=${encodeURIComponent(selectedCategory)}` : '';
    const searchQuery = debouncedSearch.length >= 2 ? `&search=${encodeURIComponent(debouncedSearch)}` : '';
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
  }, [page, selectedCategory, debouncedSearch]); // ✅ use debouncedSearch

  useEffect(() => {
    fetch('http://localhost:5000/api/settings')
      .then((res) => res.json())
      .then((data) => setStoreSettings(data))
      .catch((err) => console.error('Settings fetch error:', err));
  }, []);

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
    <div className="home-container" style={{ paddingBottom: 80 }}>
      {/* 🏪 Store Header + 🔍 Search */}
      <div className="top-bar">
        <div className="store-header" onClick={() => navigate('/home')}>
          {storeSettings?.logoUrl && (
            <img
              src={storeSettings.logoUrl.startsWith('http') ? storeSettings.logoUrl : `http://localhost:5000/${storeSettings.logoUrl}`}
              alt="Store Logo"
              className="store-logo"
            />
          )}
          <h2 className="store-name">{storeSettings?.storeName || 'My Store'}</h2>
        </div>

        <div className="search-container">
          <FaSearch className="top-icon" />
          <input
            type="text"
            className="search-bar"
            placeholder="Search Product or category"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* 🏷️ Category Filters */}
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

      {/* 📦 Product List */}
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

      {/* 🔁 Pagination */}
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

      {/* 📱 Bottom Navigation Bar */}
      <div className="bottom-nav">
        <div className="nav-item" onClick={() => navigate('/home')}>
          <FaHome />
          <span>Home</span>
        </div>
        <div className="nav-item" onClick={() => navigate('/order')}>
          <FaClipboardList />
          <span>Orders</span>
        </div>
       <div className="nav-item" onClick={() => navigate('/cart')}>
  <div style={{ position: 'relative' }}>
    <FaShoppingCart />
    {cart.length > 0 && (
      <span className="cart-badge">{cart.length}</span>
    )}
  </div>
  <span>Cart</span>
</div>

        <div className="nav-item" onClick={() => navigate('/Customerprofile')}>
          <FaUser />
          <span>Profile</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
