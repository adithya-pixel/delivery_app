const express = require('express');
const router = express.Router();

const {
  saveAddress,
  updateAddress,
  getAddresses,
  getAddressById,
} = require('../controllers/addressController');

const verifyToken = require('../middlewares/verifyToken');

router.post('/', verifyToken, saveAddress);
router.put('/:id', verifyToken, updateAddress);
router.get('/', verifyToken, getAddresses);
router.get('/:id', verifyToken, getAddressById);

module.exports = router;
