const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Auth routes
app.use('/api/auth', require('./routes/auth'));

// Load your full JSON dataset
const products = require('./products.json'); // Make sure products.json is in the same folder or give correct relative path

// Products API route with pagination, category filter, and search
app.get('/api/products', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const category = req.query.category || 'All';
  const search = req.query.search || '';

  let filtered = products;

  // Filter by category if specified and not 'All'
  if (category && category !== 'All') {
    filtered = filtered.filter(p => p.Category === category);
  }

  // Filter by search term in ProductName
  if (search) {
    filtered = filtered.filter(p =>
      p.ProductName?.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginated = filtered.slice(startIndex, endIndex);

  res.json({
    products: paginated,
    totalPages: Math.ceil(filtered.length / limit),
    currentPage: page,
    totalProducts: filtered.length,
  });
});

// Start the server once
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
