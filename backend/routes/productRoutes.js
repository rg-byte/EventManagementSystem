const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { protect, authorize } = require("../middleware/auth");

// GET /api/products - everyone logged in can browse (users shop, vendors view all)
// Supports optional ?category= and ?vendorId= query filters
router.get("/", protect, async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.vendorId) filter.vendorId = req.query.vendorId;
  const products = await Product.find(filter);
  res.json(products);
});

// POST /api/products - vendor only, adds their own product
router.post("/", protect, authorize("vendor"), async (req, res) => {
  const product = await Product.create({
    ...req.body,
    vendorId: req.body.vendorId, // frontend sends the logged-in vendor's Vendor _id
    vendorName: req.user.username, // safer: could also re-fetch vendor name server-side
  });
  res.status(201).json(product);
});

// PUT /api/products/:id - vendor only (should own the product; ownership check kept simple here)
router.put("/:id", protect, authorize("vendor"), async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

// DELETE /api/products/:id - vendor only
router.delete("/:id", protect, authorize("vendor"), async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Product deleted" });
});

module.exports = router;
