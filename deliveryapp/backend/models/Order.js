// models/Order.js

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },

  addressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    required: true
  },

  items: [
    {
      Barcode: { type: String },
      ProductName: { type: String },
      Price: { type: Number, default: 0 },
      quantity: { type: Number, default: 1 }, // ✅ default quantity
      image: { type: String },
      status: {
        type: String,
        enum: ['Pending', 'Picked', 'Packed', 'Out of Stock'],
        default: 'Pending'
      }
    }
  ],

  totalPrice: { type: Number, default: 0 },
  gst: { type: Number, default: 0 },
  grandTotal: { type: Number, default: 0 },

  paymentId: { type: String, default: null },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  // ✅ EMPLOYEE ASSIGNMENT
  assignedEmployee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    default: null
  },
  employeeStatus: {
    type: String,
    enum: ['Ready for Assembly', 'Working', 'Completed', 'Declined'],
    default: 'Ready for Assembly'
  },

  // ✅ AGENT ASSIGNMENT
  assignedAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryAgent',
    default: null
  },
  agentStatus: {
    type: String,
    enum: [
      'Waiting for Acceptance',
      'Ready for Pickup',
      'Picked Up',
      'Out for Delivery',
      'Reached at Destination',
      'Upload Proof',
      'Delivered Successful',
      'Declined'
    ],
    default: 'Waiting for Acceptance'
  },

  // ✅ ORDER PROGRESS TRACKING
  orderStatus: {
    type: String,
    enum: [
      'Waiting for Acceptance',
      'Ready for Assembly',
      'Pending',
      'In Packing',
      'Ready for Delivery',
      'Delivery in-progress',
      'Delivered',
      'Completed',
      'Declined by Employee'
    ],
    default: 'Ready for Assembly'
  },

  declineReason: { type: String, default: '' },

  // ✅ DELIVERY PROOF
  deliveryProofImage: { type: String, default: null },
  customerConfirmationNote: { type: String, default: null }
});

module.exports = mongoose.model('Order', orderSchema);
