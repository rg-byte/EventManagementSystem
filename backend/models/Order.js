const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: String,
    price: Number,
    qty: Number,
    image: String,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    txnId: { type: String, required: true, unique: true }, // e.g. "TXN001"
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: String,
    userEmail: String,
    items: [orderItemSchema],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Delivered", "Cancelled"],
      default: "Pending",
    },
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pinCode: String,
    paymentMethod: { type: String, enum: ["UPI", "Cash", "Card"], default: "UPI" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
