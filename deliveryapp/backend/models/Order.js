const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  addressId: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
  items: [
    {
      Barcode: String,
      ProductName: String,
      Price: Number,
      quantity: Number,
      image: String,
    },
  ],
  totalPrice: Number,
  gst: Number,
  grandTotal: Number,
  paymentId: String,
  paymentStatus: String,
  createdAt: { type: Date, default: Date.now }, // ✅ Use this instead of orderDate
});

module.exports = mongoose.model('Order', orderSchema);
