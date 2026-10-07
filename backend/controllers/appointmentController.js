const Appointment = require("../models/Appointment");
const Visitor = require("../models/Visitor");

const createAppointment = async (req, res) => {
  try {
    const { visitor, appointmentDate, purpose, notes } = req.body;

    if (!visitor || !appointmentDate || !purpose) {
      return res.status(400).json({
        message: "Visitor, appointment date and purpose are required",
      });
    }

    const visitorExists = await Visitor.findById(visitor);

    if (!visitorExists) {
      return res.status(404).json({
        message: "Visitor not found",
      });
    }

    const appointment = await Appointment.create({
      visitor,
      host: req.user._id,
      appointmentDate,
      purpose,
      notes,
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate("visitor")
      .populate("host", "name email role");

    res.status(201).json({
      message: "Appointment created successfully",
      appointment: populatedAppointment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create appointment",
      error: error.message,
    });
  }
};

const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("visitor")
      .populate("host", "name email role")
      .sort({ appointmentDate: 1 });

    res.json({
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch appointments",
      error: error.message,
    });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("visitor")
      .populate("host", "name email role");

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    res.json({
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch appointment",
      error: error.message,
    });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "approved",
      "rejected",
      "cancelled",
      "completed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid appointment status",
      });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    appointment.status = status;

    await appointment.save();

    const updatedAppointment = await Appointment.findById(appointment._id)
      .populate("visitor")
      .populate("host", "name email role");

    res.json({
      message: "Appointment status updated successfully",
      appointment: updatedAppointment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update appointment status",
      error: error.message,
    });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
};
