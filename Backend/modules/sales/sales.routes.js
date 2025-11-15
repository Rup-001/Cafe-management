const express = require("express");
const { getSales, getSale, getSalesReport } = require("./sales.controller");

const router = express.Router();

router.get("/report", getSalesReport);
router.get("/", getSales);
router.get("/:id", getSale);


module.exports = router;
