const express = require("express");
const { createOrder, getOrderInvoice } = require("./order.controller");

const router = express.Router();

router.post("/", createOrder);
router.get("/:id/invoice", getOrderInvoice);

module.exports = router;
