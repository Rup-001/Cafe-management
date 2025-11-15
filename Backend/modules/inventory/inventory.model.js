const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String }
});

module.exports = mongoose.model("Inventory", inventorySchema);
