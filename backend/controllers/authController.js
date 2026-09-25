const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Vendor = require("../models/Vendor");

function generateToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// POST /api/auth/login
// Body: { username, password, role }
exports.login = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
      return res.status(400).json({ message: "username, password and role are required" });
    }

    const user = await User.findOne({ username, role });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = generateToken(user);
    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error during login", error: err.message });
  }
};

// POST /api/auth/signup/user
exports.signupUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const username = name.toLowerCase().replace(/\s+/g, "").slice(0, 10) + Date.now().toString().slice(-3);
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      role: "user",
      name,
      email,
      phone,
    });

    const token = generateToken(newUser);
    res.status(201).json({
      token,
      user: { id: newUser._id, username, name, email, role: "user" },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error during signup", error: err.message });
  }
};

// POST /api/auth/signup/vendor
exports.signupVendor = async (req, res) => {
  try {
    const { name, email, password, category, contact } = req.body;
    if (!name || !email || !password || !category || !contact) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const username = name.toLowerCase().replace(/\s+/g, "").slice(0, 10) + Date.now().toString().slice(-3);
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      role: "vendor",
      name,
      email,
      category,
    });

    const newVendor = await Vendor.create({
      username,
      name,
      email,
      category,
      contact,
      membershipId: null,
    });

    const token = generateToken(newUser);
    res.status(201).json({
      token,
      user: { id: newUser._id, username, name, email, role: "vendor" },
      vendor: newVendor,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error during vendor signup", error: err.message });
  }
};
