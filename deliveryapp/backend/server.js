// 📁 backend/server.js

const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path'); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Connect MongoDB
connectDB();

// ✅ Middleware
app.use(cors());
app.use(express.json());


// ✅ Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/address', require('./routes/addressRoutes'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/admin', require('./routes/admin')); 

// Product API with filters & pagination
const products = require('./products.json');
app.get('/api/products', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const category = req.query.category || 'All';
  const search = req.query.search?.trim().toLowerCase() || '';

  let filtered = products;

  // ✅ Filter by category if not 'All'
  if (category !== 'All') {
    filtered = filtered.filter(p => p.Category?.toLowerCase() === category.toLowerCase());
  }

  // ✅ Search only if search has at least 2 characters
  if (search.length >= 2) {
    filtered = filtered.filter(p =>
      p.ProductName?.toLowerCase().includes(search)
    );
  }

  // ✅ Pagination
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  res.json({
    products: paginated,
    totalPages: Math.ceil(filtered.length / limit),
    currentPage: page,
    totalProducts: filtered.length,
  });
});


// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
