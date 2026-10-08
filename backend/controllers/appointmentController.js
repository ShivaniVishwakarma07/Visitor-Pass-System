const Appointment = require("../models/Appointment");
const Visitor = require("../models/Visitor");
const sendEmail = require("../utils/sendEmail");

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

    const appointment = await Appointment.findById(req.params.id).populate(
      "visitor",
    );

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    const previousStatus = appointment.status;

    appointment.status = status;

    await appointment.save();

    if (status === "approved" && previousStatus !== "approved") {
      try {
        await sendEmail({
          to: appointment.visitor.email,
          subject: "Visitor Appointment Approved",
          text: `Hello ${appointment.visitor.name},

Your visitor appointment has been approved.

Appointment Date: ${new Date(appointment.appointmentDate).toLocaleString()}
Purpose: ${appointment.purpose}

Please carry your valid visitor pass during your visit.

Thank you,
Visitor Pass Management System`,
          html: `
            <h2>Visitor Appointment Approved</h2>
            <p>Hello ${appointment.visitor.name},</p>
            <p>Your visitor appointment has been approved.</p>
            <p><strong>Appointment Date:</strong> ${new Date(
              appointment.appointmentDate,
            ).toLocaleString()}</p>
            <p><strong>Purpose:</strong> ${appointment.purpose}</p>
            <p>Please carry your valid visitor pass during your visit.</p>
            <p>Thank you,<br>Visitor Pass Management System</p>
          `,
        });
      } catch (emailError) {
        console.error("Appointment email failed:", emailError.message);
      }
    }

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
