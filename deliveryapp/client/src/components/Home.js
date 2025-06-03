import React, { useState, useEffect } from 'react';
import './Home.css';
import {
  FaSearch,
  FaShoppingCart,
  FaHome,
  FaThLarge,
  FaClipboardList,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Categories exactly matching backend data Category fields + 'All'
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

  // Fetch products from backend API with pagination, category and search filters
  useEffect(() => {
    const categoryQuery = selectedCategory !== 'All' ? `&category=${encodeURIComponent(selectedCategory)}` : '';
    const searchQuery = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : '';

    fetch(`http://localhost:5000/api/products?page=${page}&limit=${limit}${categoryQuery}${searchQuery}`)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        setProducts(data.products);
        setTotalPages(data.totalPages);
      })
      .catch((err) => console.error('Error fetching products:', err));
  }, [page, selectedCategory, searchTerm]);

  // Add to cart, avoid duplicates if needed
  const handleAddToCart = (product) => {
    setCart((prev) => {
      if (prev.find((p) => p.Barcode === product.Barcode)) return prev; // avoid duplicates
      return [...prev, product];
    });
  };

  // Navigation to product details
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
              setPage(1); // reset page on search
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
              setPage(1); // reset page on category change
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

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="pagination-btn"
        >
          Prev
        </button>
        <span className="pagination-info">
          Page {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="pagination-btn"
        >
          Next
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <div
          className="nav-item"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          <FaHome />
          <p>Home</p>
        </div>
        <div
          className="nav-item"
          onClick={() => navigate('/categories')}
          style={{ cursor: 'pointer' }}
        >
          <FaThLarge />
          <p>Category</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
