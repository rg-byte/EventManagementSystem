const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema(
  {
    membershipCode: { type: String, required: true, unique: true }, // e.g. "MEM001"
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    vendorName: { type: String, required: true },
    plan: { type: String, enum: ["6 months", "1 year", "2 years"], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ["Active", "Inactive", "Cancelled"], default: "Active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Membership", membershipSchema);
