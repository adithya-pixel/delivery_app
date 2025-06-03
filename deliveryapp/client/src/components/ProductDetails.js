import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ProductDetails.css';

const ProductDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { product } = location.state || {};

  if (!product) return <p>Product not found.</p>;

  return (
    <div className="product-details-container">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      <h1>{product.ProductName}</h1>
      <img
        src={product.image}
        alt={product.ProductName}
        className="details-img"
      />
      <p>{product.Description}</p>

      <div className="info-box">
        <p><strong>Brand:</strong> {product.Brand}</p>
        <p><strong>Category:</strong> {product.Category}</p>
        <p><strong>Product Line:</strong> {product.ProductLine}</p>
        <p><strong>Quantity:</strong> {product.Quantity}</p>
        <p><strong>Price:</strong> ₹{product.Price}</p>
      </div>

      <h3>Features</h3>
      <ul>
        {product.Features?.map((feat, i) => (
          <li key={i}>{feat}</li>
        ))}
      </ul>

      <h3>Specifications</h3>
      <ul>
        {typeof product.Specification === 'string' ? (
          <li>{product.Specification}</li>
        ) : (
          Object.entries(product.Specification).map(([key, val], idx) => (
            <li key={idx}>
              <strong>{key}:</strong> {val}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ProductDetails;
