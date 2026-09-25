const express = require("express");
const router = express.Router();
const Membership = require("../models/Membership");
const Vendor = require("../models/Vendor");
const { protect, authorize } = require("../middleware/auth");

const PLAN_MONTHS = { "6 months": 6, "1 year": 12, "2 years": 24 };
function addMonths(date, months) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

// GET /api/memberships - admin only, powers the Admin Reports table
router.get("/", protect, authorize("admin"), async (req, res) => {
  const memberships = await Membership.find();
  res.json(memberships);
});

// GET /api/memberships/:code - admin only, powers the "Lookup" in Update Membership
router.get("/:code", protect, authorize("admin"), async (req, res) => {
  const membership = await Membership.findOne({ membershipCode: req.params.code.toUpperCase() });
  if (!membership) return res.status(404).json({ message: "Membership not found" });
  res.json(membership);
});

// POST /api/memberships - admin only, powers Add Membership screen
router.post("/", protect, authorize("admin"), async (req, res) => {
  const { vendorId, plan, startDate, isActive } = req.body;
  const vendor = await Vendor.findById(vendorId);
  if (!vendor) return res.status(404).json({ message: "Vendor not found" });

  const count = await Membership.countDocuments();
  const membershipCode = `MEM${String(count + 1).padStart(3, "0")}`;
  const endDate = addMonths(startDate, PLAN_MONTHS[plan]);

  const membership = await Membership.create({
    membershipCode,
    vendorId: vendor._id,
    vendorName: vendor.name,
    plan,
    startDate,
    endDate,
    status: isActive ? "Active" : "Inactive",
  });

  vendor.membershipId = membershipCode;
  await vendor.save();

  res.status(201).json(membership);
});

// PUT /api/memberships/:code/extend - admin only
router.put("/:code/extend", protect, authorize("admin"), async (req, res) => {
  const { plan } = req.body;
  const membership = await Membership.findOne({ membershipCode: req.params.code.toUpperCase() });
  if (!membership) return res.status(404).json({ message: "Membership not found" });

  membership.endDate = addMonths(membership.endDate, PLAN_MONTHS[plan]);
  membership.status = "Active";
  await membership.save();
  res.json(membership);
});

// PUT /api/memberships/:code/cancel - admin only
router.put("/:code/cancel", protect, authorize("admin"), async (req, res) => {
  const membership = await Membership.findOne({ membershipCode: req.params.code.toUpperCase() });
  if (!membership) return res.status(404).json({ message: "Membership not found" });

  membership.status = "Cancelled";
  await membership.save();
  res.json(membership);
});

module.exports = router;
