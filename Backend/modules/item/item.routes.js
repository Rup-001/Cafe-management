const express = require("express");
const { createItem, getItems, updateItem } = require("./item.controller");

const router = express.Router();

router.post("/", createItem);
router.get("/", getItems);
router.put("/:id", updateItem);

module.exports = router;
