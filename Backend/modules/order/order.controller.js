const mongoose = require('mongoose');
const Order = require('./order.model');
const Item = require('../item/item.model');
const Sales = require('../sales/sales.model');
const Inventory = require('../inventory/inventory.model');
const User = require('../users/user.model');

exports.createOrder = async (req, res) => {
  try {
    // if (!mongoose.isValidObjectId(req.body.userId)) {
    //   return res.status(400).json({ message: 'Invalid user ID' });
    // }
    if (!['dine-in', 'takeout'].includes(req.body.orderType)) {
      return res.status(400).json({ message: 'Invalid order type' });
    }
    if (req.body.orderType === 'dine-in') {
      if (!req.body.tableNo || req.body.tableNo < 1 || req.body.tableNo > 10) {
        return res.status(400).json({ message: 'Table number must be between 1 and 10 for dine-in' });
      }
      if (!mongoose.isValidObjectId(req.body.responsibleBarista)) {
        return res.status(400).json({ message: 'Invalid barista ID' });
      }
      const barista = await User.findById(req.body.responsibleBarista);
      if (!barista) {
        return res.status(404).json({ message: 'Barista not found' });
      }
    }
    if (!['cash', 'CC', 'bkash', 'rocket'].includes(req.body.paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }
    if (req.body.discountPercentage && (req.body.discountPercentage < 0 || req.body.discountPercentage > 100)) {
      return res.status(400).json({ message: 'Discount percentage must be between 0 and 100' });
    }

    let total = 0;
    for (const orderItem of req.body.items) {
      if (!mongoose.isValidObjectId(orderItem.itemId)) {
        return res.status(400).json({ message: 'Invalid item ID' });
      }
      const item = await Item.findById(orderItem.itemId);
      if (!item) {
        return res.status(404).json({ message: `Item ${orderItem.itemId} not found` });
      }
      if (item.availableQuantity < orderItem.quantity) {
        return res.status(400).json({ message: `Insufficient quantity for ${item.name}` });
      }
      total += item.price * orderItem.quantity;
    }

    const discountPercentage = req.body.discountPercentage || 0;
    const takenAmount = total * (1 - discountPercentage / 100);

    const date = new Date();
    const dateStr = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear() % 100}`;
    const count = (await Order.countDocuments({ tokenNo: new RegExp(`^${dateStr}-`) })) + 1;
    const tokenNo = `${dateStr}-${count}`;

    const order = new Order({
      ...req.body,
      total,
      takenAmount,
      discountPercentage,
      tokenNo,
    });

    for (const orderItem of order.items) {
      const item = await Item.findById(orderItem.itemId);
      const inventory = await Inventory.findById(item.inventoryId);
      inventory.quantity -= orderItem.quantity;
      item.availableQuantity -= orderItem.quantity;
      await inventory.save();
      await item.save();
    }
    await order.save();

    const sale = new Sales({
      orderId: order._id,
      amount: takenAmount, // Use takenAmount for sales
      date: new Date(),
    });
    await sale.save();

    res.status(201).json(order);
  } catch (error) {
    console.log(error)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Failed to generate unique token number, try again' });
    }
    res.status(400).json({ message: error.message });
  }
};

exports.getOrderInvoice = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    const order = await Order.findById(req.params.id)
      .populate('items.itemId')
      .populate('responsibleBarista', 'name')
      .lean();
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    const invoice = {
      cafeName: 'UNISA',
      cafeAddress: 'Gulshan Dhaka',
      date: order.date,
      tokenNo: order.tokenNo,
      customerName: order.customerName || '',
      customerPhone: order.customerPhone || '',
      orderType: order.orderType,
      tableNo: order.orderType === 'dine-in' ? order.tableNo : '',
      responsibleBarista: order.orderType === 'dine-in' ? order.responsibleBarista?.name || '' : '',
      paymentMethod: order.paymentMethod,
      discountPercentage: order.discountPercentage,
      items: order.items.map((item) => ({
        name: item.itemId.name,
        quantity: item.quantity,
        price: item.itemId.price,
        total: item.quantity * item.itemId.price,
      })),
      originalTotal: order.total,
      takenAmount: order.takenAmount,
    };
    res.json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};