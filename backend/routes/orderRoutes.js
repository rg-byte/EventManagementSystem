const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { protect, authorize } = require("../middleware/auth");

function genTxnId(count) {
  return `TXN${String(count + 1).padStart(3, "0")}`;
}

// GET /api/orders - role-aware:
//   admin  -> all orders
//   user   -> only their own orders
//   vendor -> orders containing at least one of their products (filter by ?productIds=id1,id2)
router.get("/", protect, async (req, res) => {
  if (req.user.role === "admin") {
    const orders = await Order.find();
    return res.json(orders);
  }
  if (req.user.role === "user") {
    const orders = await Order.find({ userId: req.user.id });
    return res.json(orders);
  }
  if (req.user.role === "vendor") {
    const ids = (req.query.productIds || "").split(",").filter(Boolean);
    const orders = await Order.find({ "items.productId": { $in: ids } });
    return res.json(orders);
  }
  res.status(403).json({ message: "Forbidden" });
});

// POST /api/orders - user only, places a new order from their cart
router.post("/", protect, authorize("user"), async (req, res) => {
  const count = await Order.countDocuments();
  const order = await Order.create({
    ...req.body,
    txnId: genTxnId(count),
    userId: req.user.id,
    status: "Pending",
  });
  res.status(201).json(order);
});

// PUT /api/orders/:id/status - admin or vendor updates status; user can only cancel their own Pending order
router.put("/:id/status", protect, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  const { status } = req.body;

  if (req.user.role === "user") {
    if (String(order.userId) !== req.user.id || order.status !== "Pending" || status !== "Cancelled") {
      return res.status(403).json({ message: "Users may only cancel their own pending orders" });
    }
  }

  order.status = status;
  await order.save();
  res.json(order);
});

module.exports = router;
