const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  storeName: String,
  address: String,
  workingHours: String,
  latitude: Number,
  longitude: Number,
  deliveryRadius: Number,
  logoUrl: String,
}, { collection: 'settings' });

// ✅ Prevent OverwriteModelError
module.exports = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
