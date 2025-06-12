const mongoose = require('mongoose');
const Address = require('../models/Address');

// Save Address
const saveAddress = async (req, res) => {
  try {
    const newAddress = new Address({
      user_id: new mongoose.Types.ObjectId(req.user.id),
      full_name: req.body.full_name,
      phone_no: req.body.phone_no,
      house_building_name: req.body.house_building_name,
      street_area: req.body.street_area,
      city: req.body.city,
      pincode: req.body.pincode,
      state: req.body.state,
      landmark: req.body.landmark || '',
    });

    const saved = await newAddress.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Error saving address', error: err.message });
  }
};

// Update Address
const updateAddress = async (req, res) => {
  try {
    const addressId = new mongoose.Types.ObjectId(req.params.id);

    const updated = await Address.findOneAndUpdate(
      { _id: addressId, user_id: new mongoose.Types.ObjectId(req.user.id) },
      {
        full_name: req.body.full_name,
        phone_no: req.body.phone_no,
        house_building_name: req.body.house_building_name,
        street_area: req.body.street_area,
        city: req.body.city,
        pincode: req.body.pincode,
        state: req.body.state,
        landmark: req.body.landmark || '',
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

// Get All Addresses for User
const getAddresses = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const addresses = await Address.find({ user_id: userId });
    res.status(200).json(addresses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching addresses', error: err.message });
  }
};

// Get Address by ID
const getAddressById = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const addressId = new mongoose.Types.ObjectId(req.params.id);

    const address = await Address.findOne({
      _id: addressId,
      user_id: userId,
    });

    if (!address) {
      return res.status(404).json({ message: 'No address found to edit.' });
    }

    res.status(200).json(address);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching address', error: err.message });
  }
};

// Delete Address
const deleteAddress = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const addressId = new mongoose.Types.ObjectId(req.params.id);

    const deleted = await Address.findOneAndDelete({
      _id: addressId,
      user_id: userId,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Address not found or no permission to delete.' });
    }

    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting address', error: err.message });
  }
};

// Export all controller functions
module.exports = {
  saveAddress,
  updateAddress,
  getAddresses,
  getAddressById,
  deleteAddress,
};
