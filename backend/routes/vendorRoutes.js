const express = require("express");
const router = express.Router();
const Vendor = require("../models/Vendor");
const { protect, authorize } = require("../middleware/auth");

// GET /api/vendors - anyone logged in can browse vendors (User portal needs this)
router.get("/", protect, async (req, res) => {
  const vendors = await Vendor.find();
  res.json(vendors);
});

// GET /api/vendors/:id
router.get("/:id", protect, async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) return res.status(404).json({ message: "Vendor not found" });
  res.json(vendor);
});

// POST /api/vendors - admin only (manual creation outside signup flow)
router.post("/", protect, authorize("admin"), async (req, res) => {
  const vendor = await Vendor.create(req.body);
  res.status(201).json(vendor);
});

// PUT /api/vendors/:id - admin only
router.put("/:id", protect, authorize("admin"), async (req, res) => {
  const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!vendor) return res.status(404).json({ message: "Vendor not found" });
  res.json(vendor);
});

// DELETE /api/vendors/:id - admin only
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  const vendor = await Vendor.findByIdAndDelete(req.params.id);
  if (!vendor) return res.status(404).json({ message: "Vendor not found" });
  res.json({ message: "Vendor deleted" });
});

module.exports = router;
