import React from 'react';
import { useLocation } from 'react-router-dom';

const ProductDetails = () => {
  const { state } = useLocation();

  if (!state) return <div>Product not found</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>{state.name} {state.img}</h2>
      <p>Quantity: {state.qty}</p>
      <p>Price: ₹{state.price}</p>
      <p>Category: {state.category}</p>
      <button>Add to Cart</button>
    </div>
  );
};

export default ProductDetails;
