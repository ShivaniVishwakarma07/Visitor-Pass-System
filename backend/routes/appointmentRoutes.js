const express = require("express");

const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
} = require("../controllers/appointmentController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createAppointment);

router.get("/", protect, getAppointments);

router.get("/:id", protect, getAppointmentById);

router.patch("/:id/status", protect, updateAppointmentStatus);

module.exports = router;
