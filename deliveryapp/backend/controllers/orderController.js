// controllers/orderController.js
const Order = require('../models/Order');

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('assignedAgent', 'name')
      .populate('user', 'name')
      .populate('addressId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getOrderById };
