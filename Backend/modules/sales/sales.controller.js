const mongoose = require("mongoose");
const Sales = require("./sales.model");

exports.getSales = async (req, res) => {
  try {
    const sales = await Sales.find().populate("orderId").lean();
    res.json(sales);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getSale = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid sale ID" });
    }
    const sale = await Sales.findById(req.params.id).populate("orderId").lean();
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }
    res.json(sale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getSalesReport = async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;

    if (!type || !["month", "range"].includes(type)) {
      return res
        .status(400)
        .json({ message: 'Invalid type (must be "month" or "range")' });
    }

    let start, end;
    if (type === "month") {
      if (startDate && endDate) {
        if (
          !/^\d{4}-\d{2}-\d{2}$/.test(startDate) ||
          !/^\d{4}-\d{2}-\d{2}$/.test(endDate)
        ) {
          return res
            .status(400)
            .json({ message: "Invalid date format (YYYY-MM-DD)" });
        }
        start = new Date(startDate);
        end = new Date(endDate);
        if (
          start.getMonth() !== end.getMonth() ||
          start.getFullYear() !== end.getFullYear()
        ) {
          return res
            .status(400)
            .json({ message: "Dates must be within the same month" });
        }
      } else {
        const now = new Date();
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      }
    } else {
      if (
        !startDate ||
        !endDate ||
        !/^\d{4}-\d{2}-\d{2}$/.test(startDate) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(endDate)
      ) {
        return res
          .status(400)
          .json({ message: "Invalid or missing dates (YYYY-MM-DD)" });
      }
      start = new Date(startDate);
      end = new Date(endDate);
      end.setDate(end.getDate() + 1); // Include endDate
      if (start > end) {
        return res
          .status(400)
          .json({ message: "startDate must be before endDate" });
      }
    }

    const sales = await Sales.find({
      date: { $gte: start, $lt: end },
    }).lean();

    const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0);
    const totalOrders = sales.length;

    const response =
      type === "month"
        ? {
            period: `${start.getFullYear()}-${String(
              start.getMonth() + 1
            ).padStart(2, "0")}`,
            totalSales,
            totalOrders,
          }
        : {
            startDate,
            endDate: req.query.endDate,
            totalSales,
            totalOrders,
          };

    res.json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
