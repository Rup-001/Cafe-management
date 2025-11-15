require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const app = express();
const database = require("./config/database");
const authRoute = require("./modules/users/auth.router");
const menuRoute = require("./modules/item/item.routes");
const inventoryRoute = require("./modules/inventory/inventory.routes");
const orderRoute = require("./modules/order/order.routes");
const salesRoute = require("./modules/sales/sales.routes");
const passport = require("./config/passportConfig");
app.use(passport.initialize());

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use('/uploads', express.static('uploads'));
// Sample route for testing
app.use("/", authRoute);
app.use("/menu", menuRoute);
app.use("/inventory", inventoryRoute);
app.use("/order", orderRoute);
app.use("/sales", salesRoute);

// Handle undefined routes
app.use((req, res, next) => {
  res.status(404).send("Route not found");
});

module.exports = app;
