const mongoose = require("mongoose");
const Item = require("./item.model");
const Inventory = require("../inventory/inventory.model");

exports.createItem = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.body.inventoryId)) {
      return res.status(400).json({ message: "Invalid inventory ID" });
    }
    const inventory = await Inventory.findById(req.body.inventoryId);
    if (!inventory) {
      return res.status(404).json({ message: "Inventory item not found" });
    }
    if (await Item.findOne({ name: req.body.name })) {
      return res.status(400).json({ message: "Item name already exists" });
    }
    const item = new Item({
      ...req.body,
      availableQuantity: inventory.quantity,
    });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getItems = async (req, res) => {
  try {
    const items = await Item.find({ availableQuantity: { $gt: 0 } }).lean();
    res.json(items);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid item ID" });
    }
    if (
      req.body.inventoryId &&
      !mongoose.isValidObjectId(req.body.inventoryId)
    ) {
      return res.status(400).json({ message: "Invalid inventory ID" });
    }
    if (
      req.body.name &&
      (await Item.findOne({ name: req.body.name, _id: { $ne: req.params.id } }))
    ) {
      return res.status(400).json({ message: "Item name already exists" });
    }
    if (req.body.inventoryId) {
      const inventory = await Inventory.findById(req.body.inventoryId);
      if (!inventory) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      req.body.availableQuantity = inventory.quantity;
    }
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
