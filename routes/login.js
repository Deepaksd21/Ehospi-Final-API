const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  verifyOTP,
  phoneLogin,
  createProfile,
  showProfile,
} = require("../controllers/phoneLogin");
router.get("/profile", auth.verifyToken, showProfile);
router.post("/login_with_phone", phoneLogin);
router.post("/verifyOTP", verifyOTP);
router.post("/register_with_phone", auth.verifyToken, createProfile);
router.get("/profile", auth.verifyToken, showProfile);
module.exports = router;
