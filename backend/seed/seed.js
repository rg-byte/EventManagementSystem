// Run with: npm run seed
// Populates MongoDB with the same demo data the frontend used to hardcode
// (admin/admin123, vendor1/vendor123, user1/user123, etc.)

require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");
const Vendor = require("../models/Vendor");
const Membership = require("../models/Membership");
const Product = require("../models/Product");

async function seed() {
  await connectDB();

  console.log("Clearing existing data...");
  await Promise.all([
    User.deleteMany({}),
    Vendor.deleteMany({}),
    Membership.deleteMany({}),
    Product.deleteMany({}),
  ]);

  console.log("Creating vendors...");
  const vendorsData = [
    { username: "vendor1", name: "Royal Caterers", email: "royal@events.com", category: "Catering", contact: "9876543210" },
    { username: "vendor2", name: "Bloom Florists", email: "bloom@events.com", category: "Florist", contact: "9123456789" },
    { username: "vendor3", name: "Decor Dreams", email: "decor@events.com", category: "Decoration", contact: "8765432109" },
    { username: "vendor4", name: "Bright Lights", email: "lights@events.com", category: "Lighting", contact: "7654321098" },
  ];
  const vendors = await Vendor.insertMany(vendorsData);

  console.log("Creating memberships...");
  const memberships = await Membership.insertMany([
    { membershipCode: "MEM001", vendorId: vendors[0]._id, vendorName: vendors[0].name, plan: "1 year", startDate: "2025-01-01", endDate: "2026-01-01", status: "Active" },
    { membershipCode: "MEM002", vendorId: vendors[1]._id, vendorName: vendors[1].name, plan: "6 months", startDate: "2025-06-01", endDate: "2025-12-01", status: "Active" },
    { membershipCode: "MEM003", vendorId: vendors[2]._id, vendorName: vendors[2].name, plan: "2 years", startDate: "2024-01-01", endDate: "2026-01-01", status: "Active" },
    { membershipCode: "MEM004", vendorId: vendors[3]._id, vendorName: vendors[3].name, plan: "6 months", startDate: "2025-08-01", endDate: "2026-02-01", status: "Active" },
  ]);

  for (let i = 0; i < vendors.length; i++) {
    vendors[i].membershipId = memberships[i].membershipCode;
    await vendors[i].save();
  }

  console.log("Creating users (admin, vendor logins, a normal user)...");
  const hash = async (pw) => bcrypt.hash(pw, 10);
  await User.insertMany([
    { username: "admin", password: await hash("admin123"), role: "admin", name: "Administrator", email: "admin@events.com" },
    { username: "vendor1", password: await hash("vendor123"), role: "vendor", name: "Royal Caterers", email: "royal@events.com", category: "Catering", membershipId: "MEM001" },
    { username: "vendor2", password: await hash("vendor123"), role: "vendor", name: "Bloom Florists", email: "bloom@events.com", category: "Florist", membershipId: "MEM002" },
    { username: "user1", password: await hash("user123"), role: "user", name: "John Doe", email: "john@events.com", phone: "9876543210" },
  ]);

  console.log("Creating products...");
  await Product.insertMany([
    { vendorId: vendors[0]._id, vendorName: "Royal Caterers", category: "Catering", name: "Wedding Feast Package", price: 15000, image: "🍽️", status: "Available" },
    { vendorId: vendors[0]._id, vendorName: "Royal Caterers", category: "Catering", name: "Corporate Lunch", price: 5000, image: "🥘", status: "Available" },
    { vendorId: vendors[1]._id, vendorName: "Bloom Florists", category: "Florist", name: "Bridal Bouquet", price: 3500, image: "💐", status: "Available" },
    { vendorId: vendors[1]._id, vendorName: "Bloom Florists", category: "Florist", name: "Stage Floral Arch", price: 12000, image: "🌸", status: "Available" },
    { vendorId: vendors[2]._id, vendorName: "Decor Dreams", category: "Decoration", name: "Mandap Setup", price: 25000, image: "✨", status: "Available" },
    { vendorId: vendors[2]._id, vendorName: "Decor Dreams", category: "Decoration", name: "Reception Decor", price: 18000, image: "🎊", status: "Available" },
    { vendorId: vendors[3]._id, vendorName: "Bright Lights", category: "Lighting", name: "LED Stage Lighting", price: 8000, image: "💡", status: "Available" },
    { vendorId: vendors[3]._id, vendorName: "Bright Lights", category: "Lighting", name: "Fairy Lights Setup", price: 4500, image: "🌟", status: "Available" },
  ]);

  console.log("Seed complete. Demo logins: admin/admin123, vendor1/vendor123, user1/user123");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
