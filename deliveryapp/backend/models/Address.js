const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  full_name: { type: String, required: true, maxlength: 100 },
  phone_no: { type: String, required: true, maxlength: 15 },
  house_building_name: { type: String, required: true, maxlength: 100 },
  street_area: { type: String, required: true, maxlength: 100 },
  city: { type: String, required: true, maxlength: 100 },
  pincode: { type: String, required: true, maxlength: 10 },
  state: { type: String, required: true, maxlength: 100 },
  landmark: { type: String, default: '', maxlength: 100 },

  // ✅ Add these
  latitude: { type: Number, default: null },
  longitude: { type: Number, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Address', addressSchema);
