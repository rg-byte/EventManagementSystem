const express = require("express");
const router = express.Router();
const { login, signupUser, signupVendor } = require("../controllers/authController");

router.post("/login", login);
router.post("/signup/user", signupUser);
router.post("/signup/vendor", signupVendor);

module.exports = router;
