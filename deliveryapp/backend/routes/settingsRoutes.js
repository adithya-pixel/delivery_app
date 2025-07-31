// backend/routes/settingsRoutes.js (used by Delivery App)
const express = require('express');
const router = express.Router();
const Settings = require('../models/settings');

router.get('/', async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }

    // ✅ Always send full logo URL to frontend
    const fullLogoUrl = settings.logoUrl?.startsWith('/uploads')
      ? `${req.protocol}://${req.get('host')}${settings.logoUrl}`
      : settings.logoUrl;

    res.json({
      ...settings.toObject(),
      logoUrl: fullLogoUrl, // full path like http://localhost:5000/uploads/logo-xyz.jpg
    });
  } catch (error) {
    console.error('❌ Error fetching settings:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
