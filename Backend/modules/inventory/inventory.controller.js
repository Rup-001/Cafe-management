const mongoose = require('mongoose');
const Inventory = require('./inventory.model');

exports.createInventoryItem = async (req, res) => {
  try {
  const { itemName, quantity, unit, category } = req.body;

  const existingitemData = await Inventory.findOne({ itemName });
  if (existingitemData) {
    return res.status(400).json({ message: 'Inventory item already exists' });
  }

  const itemData = {
    itemName,
    quantity,
    unit,
    category
  };

  if (req.file) {
    itemData.imageUrl = `/uploads/items/${req.file.filename}`;
  }

  const item = new Inventory(itemData);
  await item.save();

  res.status(201).json(item);

} catch (error) {
  res.status(400).json({ message: error.message });
}

};

exports.updateInventoryItem = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid inventory ID' });
    }
    const updateData = {};
    if (req.body.itemName) updateData.itemName = req.body.itemName;
    if (req.body.quantity) updateData.quantity = req.body.quantity;
    if (req.body.unit) updateData.unit = req.body.unit;
    if (req.body.category) updateData.category = req.body.category;
    if (req.file) updateData.imageUrl = `/uploads/items/${req.file.filename}`;
    const item = await Inventory.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!item) return res.status(404).json({ message: 'Inventory item not found' });
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getInventoryItems = async (req, res) => {
  try {
    const items = await Inventory.find().lean();
    res.json(items);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getInventoryItem = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid inventory ID' });
    }
    const item = await Inventory.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ message: 'Inventory item not found' });
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllAvailableItems = async (req, res) => {
  try {
    const items = await Inventory.find().lean();
    res.json(items);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
