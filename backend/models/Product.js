const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    vendorName: { type: String, required: true },
    category: {
      type: String,
      enum: ["Catering", "Florist", "Decoration", "Lighting"],
      required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 1 },
    image: { type: String, default: "📦" }, // emoji icon, matches frontend
    status: { type: String, enum: ["Available", "Unavailable"], default: "Available" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
