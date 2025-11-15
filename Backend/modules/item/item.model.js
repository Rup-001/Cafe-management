const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  inventoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Inventory",
    required: true,
  },
  availableQuantity: { type: Number, default: 0 },
  category: { type: String},
});

module.exports = mongoose.model("Item", itemSchema);
