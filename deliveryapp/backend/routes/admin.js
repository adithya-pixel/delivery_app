// 📁 backend/routes/admin.js
const express = require('express');
const router = express.Router();
const Settings = require('../models/settings'); // ✅ Use the central model file

// ✅ GET store details API
router.get('/get-store', async (req, res) => {
  try {
    const store = await Settings.findOne();
    if (!store) return res.status(404).json({ message: 'Store not found' });
    res.json(store);
  } catch (err) {
    console.error('❌ Error fetching store:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
