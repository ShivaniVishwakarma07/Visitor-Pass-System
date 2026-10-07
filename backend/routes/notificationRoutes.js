const express = require("express");

const {
  sendAppointmentNotification,
} = require("../controllers/notificationController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/appointment",
  protect,
  authorize("admin", "security", "employee"),
  sendAppointmentNotification,
);

module.exports = router;
