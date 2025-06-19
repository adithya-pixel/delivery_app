const mongoose = require('mongoose');
const Address = require('../models/Address');
const fetch = require('node-fetch'); // Use node-fetch v2

// 🌍 Get Coordinates
const getCoordinatesFromAddress = async (addressString) => {
  const tryGeocode = async (query) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    return await response.json();
  };

  try {
    let geoData = await tryGeocode(addressString);

    if (!geoData || geoData.length === 0) {
      const parts = addressString.split(',').map(s => s.trim());
      for (let i = 2; i < parts.length; i++) {
        const fallbackQuery = parts.slice(i).join(', ');
        geoData = await tryGeocode(fallbackQuery);
        if (geoData && geoData.length > 0) break;
      }
    }

    if (geoData && geoData.length > 0) {
      const lat = parseFloat(geoData[0].lat);
      const lon = parseFloat(geoData[0].lon);
      return { latitude: lat, longitude: lon };
    }

    return { latitude: null, longitude: null };
  } catch (err) {
    console.error('❌ Error fetching coordinates:', err.message);
    return { latitude: null, longitude: null };
  }
};
const saveAddress = async (req, res) => {
  try {
    const {
      full_name,
      phone_no,
      house_building_name,
      street_area,
      locality,
      city,
      pincode,
      state,
      landmark,
      isDefault
    } = req.body;

    const userId = new mongoose.Types.ObjectId(req.user.id);
    const addressString = `${house_building_name}, ${street_area}, ${locality}, ${city}, ${pincode}, ${state}, India`;
    const { latitude, longitude } = await getCoordinatesFromAddress(addressString);

    // ✅ If this is marked default, remove default from other addresses
    if (isDefault === true || isDefault === 'true') {
      await Address.updateMany(
        { user_id: userId, isDefault: true },
        { $set: { isDefault: false } }
      );
    }

    const newAddress = new Address({
      user_id: userId,
      full_name,
      phone_no,
      house_building_name,
      street_area,
      locality,
      city,
      pincode,
      state,
      landmark,
      latitude,
      longitude,
      isDefault: !!isDefault
    });

    const saved = await newAddress.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Error saving address', error: err.message });
  }
};

const updateAddress = async (req, res) => {
  try {
    const {
      full_name,
      phone_no,
      house_building_name,
      street_area,
      locality,
      city,
      pincode,
      state,
      landmark,
      isDefault
    } = req.body;

    const userId = new mongoose.Types.ObjectId(req.user.id);
    const addressId = new mongoose.Types.ObjectId(req.params.id);
    const addressString = `${house_building_name}, ${street_area}, ${locality}, ${city}, ${pincode}, ${state}, India`;
    const { latitude, longitude } = await getCoordinatesFromAddress(addressString);

    // ✅ If this is marked default, reset others
    if (isDefault === true || isDefault === 'true') {
      await Address.updateMany(
        { user_id: userId, isDefault: true, _id: { $ne: addressId } },
        { $set: { isDefault: false } }
      );
    }

    const updated = await Address.findOneAndUpdate(
      { _id: addressId, user_id: userId },
      {
        full_name,
        phone_no,
        house_building_name,
        street_area,
        locality,
        city,
        pincode,
        state,
        landmark,
        latitude,
        longitude,
        isDefault: !!isDefault
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Address not found or no permission to update.' });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating address', error: err.message });
  }
};


// ✅ Get All Addresses
const getAddresses = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    console.log("🔍 Getting addresses for user:", userId);
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

module.exports = {
  saveAddress,
  updateAddress,
  getAddresses,
  getAddressById,
  deleteAddress
};
