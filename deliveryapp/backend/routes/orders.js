const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const userAuth = require('../middlewares/userAuth'); 

//  POST /api/orders - Place a new order
router.post('/', userAuth, async (req, res) => {
  try {
    console.log('📦 Incoming Order:', req.body);

    const {
      addressId,
      items,
      totalPrice,
      gst,
      grandTotal,
      paymentId = null,
      paymentStatus = 'Pending',
    } = req.body;

    // Validate fields
    if (!addressId || !items || items.length === 0 || totalPrice == null || grandTotal == null) {
      return res.status(400).json({ error: '❗ Missing required order details' });
    }

    const newOrder = new Order({
      user: req.userId,
      addressId,
      items,
      totalPrice: parseFloat(totalPrice),
      gst: parseFloat(gst || 0),
      grandTotal: parseFloat(grandTotal),
      paymentId,
      paymentStatus,
      createdAt: new Date(),
    });

    await newOrder.save();

    res.status(201).json({
      message: '✅ Order placed successfully',
      order: newOrder,
    });
  } catch (error) {
    console.error('❌ Order save failed:', error.message);
    res.status(500).json({
      error: 'Order save failed',
      details: error.message,
    });
  }
});

// GET /api/orders - Get all orders for logged-in user
router.get('/', userAuth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    console.error('❌ Failed to fetch orders:', err.message);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

//  NEW: GET /api/orders/:id - Get full details of a single order
router.get('/:id', userAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('assignedAgent', 'name')
      .populate('assignedEmployee', 'name') 
      .populate('user', 'name email') 
      .populate('addressId');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Ensure the logged-in user is allowed to view this order
    if (order.user && order.user._id.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized access to this order' });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error('❌ Failed to get order:', error.message);
    res.status(500).json({ error: 'Failed to get order' });
  }
});

module.exports = router;
