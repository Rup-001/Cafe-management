const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
      quantity: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true }, // Original total before discount
  takenAmount: { type: Number, required: true }, // Final amount after discount
  discountPercentage: { type: Number, default: 0 }, // e.g., 10 for 10%
  paymentMethod: { type: String, enum: ['cash', 'CC', 'bkash', 'rocket'], required: true },
  orderType: { type: String, enum: ['dine-in', 'takeout'], required: true },
  tableNo: { type: Number, min: 1, max: 10 }, // Required for dine-in
  responsibleBarista: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Required for dine-in
  tokenNo: { type: String, required: true, unique: true },
  customerName: { type: String },
  customerPhone: { type: String },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);