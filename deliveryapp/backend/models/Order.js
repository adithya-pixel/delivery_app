const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  addressId: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },

  // 🛒 Items with individual item status
  items: [
    {
      Barcode: String,
      ProductName: String,
      Price: Number,
      quantity: Number,
      image: String,
      status: { type: String, default: 'Pending' } // Pending, Picked, Packed
    },
  ],

  // 💰 Price details
  totalPrice: Number,
  gst: Number,
  grandTotal: Number,

  // 💳 Payment details
  paymentId: String,
  paymentStatus: { type: String, default: 'Pending' },

  // 📅 Timestamps
  createdAt: { type: Date, default: Date.now },

  // 👨‍💼 Employee assignment
  assignedEmployee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
  employeeStatus: {
    type: String,
    enum: [
      'Ready for Assembly',
      'Ready for Packing',
      'Ready for Delivery',
      'Completed',
      null
    ],
    default: null
  },

  // 🛵 Agent assignment
  assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryAgent', default: null },
  agentStatus: {
    type: String,
    enum: [
      'Delivery in-progress',
      'Delivered',
      'Completed',
      null
    ],
    default: null
  },

  // ✅ Proof of Delivery
  deliveryProofImage: { type: String, default: null }, // e.g. filename or URL
  customerConfirmationNote: { type: String, default: null }, // e.g. "Received by Ramesh"
});

module.exports = mongoose.model('Order', orderSchema);
