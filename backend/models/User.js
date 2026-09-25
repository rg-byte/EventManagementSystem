const mongoose = require("mongoose");

// One collection holds all three roles (admin/vendor/user), same as the
// frontend's INIT_USERS array - role field decides what a login can do.
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true }, // stored as a bcrypt hash
    role: { type: String, enum: ["admin", "vendor", "user"], required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String }, // used by "user" role
    category: { type: String }, // used by "vendor" role
    membershipId: { type: String, default: null }, // used by "vendor" role
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
