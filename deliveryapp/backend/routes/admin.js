// 📁 backend/routes/admin.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define model schema for "settings"
const Setting = mongoose.model(
  'Settings',
  new mongoose.Schema({
    storeName: String,
    address: String,
    workingHours: String,
    latitude: Number,
    longitude: Number,
    deliveryRadius: Number,
  })
);

// GET store details API
router.get('/get-store', async (req, res) => {
  try {
    const store = await Setting.findOne();
    if (!store) return res.status(404).json({ message: 'Store not found' });
    res.json(store);
  } catch (err) {
    console.error('Error fetching store:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
