const express = require("express");
const { createInventoryItem, updateInventoryItem, getInventoryItems, getInventoryItem, getAllAvailableItems } = require('./inventory.controller');
const { upload } = require('../../middleware/upload.middleware');
const router = express.Router();

router.post('/', upload.single('image'), createInventoryItem);
router.put('/:id', upload.single('image'), updateInventoryItem);
router.get('/', getInventoryItems);
router.get('/:id', getInventoryItem);

router.get('/all-items-available', getAllAvailableItems);


module.exports = router;
