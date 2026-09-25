const express = require("express");
const router = express.Router();
const Guest = require("../models/Guest");
const { protect, authorize } = require("../middleware/auth");

// GET /api/guests - user only, returns their own guest list
router.get("/", protect, authorize("user"), async (req, res) => {
  const guests = await Guest.find({ userId: req.user.id });
  res.json(guests);
});

// POST /api/guests - user only, adds a guest to their own list
router.post("/", protect, authorize("user"), async (req, res) => {
  const guest = await Guest.create({ ...req.body, userId: req.user.id });
  res.status(201).json(guest);
});

// PUT /api/guests/:id - user only, e.g. toggling RSVP
router.put("/:id", protect, authorize("user"), async (req, res) => {
  const guest = await Guest.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id }, // ensures a user can't edit someone else's guest
    req.body,
    { new: true }
  );
  if (!guest) return res.status(404).json({ message: "Guest not found" });
  res.json(guest);
});

// DELETE /api/guests/:id - user only
router.delete("/:id", protect, authorize("user"), async (req, res) => {
  const guest = await Guest.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!guest) return res.status(404).json({ message: "Guest not found" });
  res.json({ message: "Guest deleted" });
});

module.exports = router;
