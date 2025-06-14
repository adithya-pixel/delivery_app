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

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/address', require('./routes/addressRoutes')); // ✅ NEW: Delivery address route

// Load your full JSON dataset
const products = require('./products.json'); // Ensure this path is correct

// Products API route with pagination, category filter, and search
app.get('/api/products', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const category = req.query.category || 'All';
  const search = req.query.search || '';

  let filtered = products;

  if (category && category !== 'All') {
    filtered = filtered.filter(p => p.Category === category);
  }

  if (search) {
    filtered = filtered.filter(p =>
      p.ProductName?.toLowerCase().includes(search.toLowerCase())
    );
  }

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

// Import your admin route
const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes); // Use it as /admin/get-store
app.use('/api/orders', require('./routes/orders'));
const feedbackRoutes = require('./routes/feedbackRoutes'); // ✅ Added feedback route import
app.use('/api/feedback', feedbackRoutes); // ✅ Use feedback route

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
