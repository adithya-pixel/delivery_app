const mongoose = require('mongoose');
const Address = require('../models/Address');
const fetch = require('node-fetch'); // Make sure to use node-fetch v2

// 🌍 Utility: Get Coordinates with Fallback
const getCoordinatesFromAddress = async (addressString) => {
  const tryGeocode = async (query) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    return await response.json();
  };

  try {
    console.log("🛰️ Trying full address:", addressString);
    let geoData = await tryGeocode(addressString);

    if (!geoData || geoData.length === 0) {
      const parts = addressString.split(',').map(s => s.trim());
      for (let i = 2; i < parts.length; i++) {
        const fallbackQuery = parts.slice(i).join(', ');
        console.log("🔁 Trying fallback:", fallbackQuery);
        geoData = await tryGeocode(fallbackQuery);
        if (geoData && geoData.length > 0) break;
      }
    }

    if (geoData && geoData.length > 0) {
      const lat = parseFloat(geoData[0].lat);
      const lon = parseFloat(geoData[0].lon);
      console.log("📍 Got coordinates:", lat, lon);
      return { latitude: lat, longitude: lon };
    }

    console.warn("⚠️ No coordinates found");
    return { latitude: null, longitude: null };
  } catch (err) {
    console.error('❌ Error fetching coordinates:', err.message);
    return { latitude: null, longitude: null };
  }
};

// ✅ Save Address
const saveAddress = async (req, res) => {
  try {
    const { full_name, phone_no, house_building_name, street_area, city, pincode, state, landmark } = req.body;
    const addressString = `${house_building_name}, ${street_area}, ${city}, ${pincode}, ${state}, India`;

    const { latitude, longitude } = await getCoordinatesFromAddress(addressString);
    console.log("📌 Final Coordinates for save:", latitude, longitude);

    const newAddress = new Address({
      user_id: new mongoose.Types.ObjectId(req.user.id),
      full_name,
      phone_no,
      house_building_name,
      street_area,
      city,
      pincode,
      state,
      landmark,
      latitude,
      longitude
    });

    const saved = await newAddress.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Error saving address:", err.message);
    res.status(500).json({ message: 'Error saving address', error: err.message });
  }
};

// ✅ Update Address
const updateAddress = async (req, res) => {
  try {
    const { full_name, phone_no, house_building_name, street_area, city, pincode, state, landmark } = req.body;
    const addressId = new mongoose.Types.ObjectId(req.params.id);
    const addressString = `${house_building_name}, ${street_area}, ${city}, ${pincode}, ${state}, India`;

    const { latitude, longitude } = await getCoordinatesFromAddress(addressString);
    console.log("📌 Final Coordinates for update:", latitude, longitude);

    const updated = await Address.findOneAndUpdate(
      { _id: addressId, user_id: new mongoose.Types.ObjectId(req.user.id) },
      {
        full_name,
        phone_no,
        house_building_name,
        street_area,
        city,
        pincode,
        state,
        landmark,
        latitude,
        longitude
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Address not found or no permission to update.' });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error("❌ Error updating address:", err.message);
    res.status(500).json({ message: 'Error updating address', error: err.message });
  }
};

// ✅ Get All Addresses
const getAddresses = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const addresses = await Address.find({ user_id: userId });
    res.status(200).json(addresses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching addresses', error: err.message });
  }
};

// ✅ Get Address by ID
const getAddressById = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const addressId = new mongoose.Types.ObjectId(req.params.id);

    const address = await Address.findOne({
      _id: addressId,
      user_id: userId
    });

    if (!address) {
      return res.status(404).json({ message: 'No address found to edit.' });
    }

    res.status(200).json(address);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching address', error: err.message });
  }
};

// ✅ Delete Address
const deleteAddress = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const addressId = new mongoose.Types.ObjectId(req.params.id);

    const deleted = await Address.findOneAndDelete({
      _id: addressId,
      user_id: userId
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Address not found or no permission to delete.' });
    }

    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting address', error: err.message });
  }
};

// ✅ Export all
module.exports = {
  saveAddress,
  updateAddress,
  getAddresses,
  getAddressById,
  deleteAddress
};
