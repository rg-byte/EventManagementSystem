const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    category: {
      type: String,
      enum: ["Catering", "Florist", "Decoration", "Lighting"],
      required: true,
    },
    contact: { type: String, required: true },
    membershipId: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vendor", vendorSchema);
