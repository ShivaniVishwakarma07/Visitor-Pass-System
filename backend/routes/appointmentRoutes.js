const express = require("express");

const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
} = require("../controllers/appointmentController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("admin", "security", "employee"),
  createAppointment,
);

router.get(
  "/",
  protect,
  authorize("admin", "security", "employee"),
  getAppointments,
);

router.get(
  "/:id",
  protect,
  authorize("admin", "security", "employee"),
  getAppointmentById,
);

router.patch(
  "/:id/status",
  protect,
  authorize("admin", "security"),
  updateAppointmentStatus,
);

module.exports = router;
