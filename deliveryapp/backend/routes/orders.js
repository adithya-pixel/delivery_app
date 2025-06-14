const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const userAuth = require('../middlewares/userAuth'); // ✅ fixed path spelling

// 👉 POST /api/orders - Place a new order
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

    // ✅ Validate required fields
    if (!addressId || !items || items.length === 0 || totalPrice == null || grandTotal == null) {
      return res.status(400).json({ error: '❗ Missing required order details' });
    }

    // ✅ Create and save the new order
    const newOrder = new Order({
      user: req.userId, // ✅ get user ID from middleware
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

// 👉 GET /api/orders - Get all orders for that user
router.get('/', userAuth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    console.error('❌ Failed to fetch orders:', err.message);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

module.exports = router;
