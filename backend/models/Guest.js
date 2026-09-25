const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    event: { type: String, enum: ["Wedding", "Corporate", "Birthday", "Other"], default: "Wedding" },
    rsvp: { type: Boolean, default: false },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Guest", guestSchema);
