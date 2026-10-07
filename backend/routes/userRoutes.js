const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Profile fetched successfully",
    user: req.user,
  });
});

router.get("/admin", protect, authorize("admin"), (req, res) => {
  res.json({
    message: "Welcome to the admin area",
    user: req.user,
  });
});

module.exports = router;
