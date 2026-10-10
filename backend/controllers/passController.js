const generatePassPDF = require("../utils/generatePassPDF");
const crypto = require("crypto");
const QRCode = require("qrcode");
const Pass = require("../models/Pass");
const Appointment = require("../models/Appointment");

const createPass = async (req, res) => {
  try {
    const { appointment, validFrom, validUntil } = req.body;

    if (!appointment || !validFrom || !validUntil) {
      return res.status(400).json({
        message: "Appointment, valid from and valid until are required",
      });
    }

    const appointmentData = await Appointment.findById(appointment)
      .populate("visitor")
      .populate("host", "name email role");

    if (!appointmentData) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    if (
      req.user.role === "employee" &&
      appointmentData.host._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You can only issue passes for your own appointments",
      });
    }

    if (appointmentData.status !== "approved") {
      return res.status(400).json({
        message: "Pass can only be issued for an approved appointment",
      });
    }

    const existingPass = await Pass.findOne({ appointment });

    if (existingPass) {
      return res.status(400).json({
        message: "A pass already exists for this appointment",
      });
    }

    const passNumber = `VP-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    const qrData = JSON.stringify({
      passNumber,
      appointmentId: appointmentData._id,
      visitorId: appointmentData.visitor._id,
    });

    const qrCode = await QRCode.toDataURL(qrData);

    const pass = await Pass.create({
      passNumber,
      visitor: appointmentData.visitor._id,
      appointment,
      qrCode,
      validFrom,
      validUntil,
    });

    const populatedPass = await Pass.findById(pass._id)
      .populate("visitor")
      .populate("appointment");

    res.status(201).json({
      message: "Visitor pass issued successfully",
      pass: populatedPass,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to issue visitor pass",
      error: error.message,
    });
  }
};

const getPasses = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "employee") {
      const appointments = await Appointment.find({
        host: req.user._id,
      }).select("_id");

      const appointmentIds = appointments.map((item) => item._id);

      filter = {
        appointment: { $in: appointmentIds },
      };
    }

    const passes = await Pass.find(filter)
      .populate("visitor")
      .populate("appointment")
      .sort({ createdAt: -1 });

    res.json({
      count: passes.length,
      passes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch passes",
      error: error.message,
    });
  }
};

const getPassById = async (req, res) => {
  try {
    const pass = await Pass.findById(req.params.id)
      .populate("visitor")
      .populate("appointment");

    if (!pass) {
      return res.status(404).json({
        message: "Pass not found",
      });
    }

    if (req.user.role === "employee") {
      const appointment = await Appointment.findById(pass.appointment);

      if (
        !appointment ||
        appointment.host.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({
          message: "You cannot access this pass",
        });
      }
    }

    res.json({
      pass,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch pass",
      error: error.message,
    });
  }
};

const downloadPassPDF = async (req, res) => {
  try {
    const pass = await Pass.findById(req.params.id)
      .populate("visitor")
      .populate("appointment");

    if (!pass) {
      return res.status(404).json({
        message: "Pass not found",
      });
    }

    if (req.user.role === "employee") {
      const appointment = await Appointment.findById(pass.appointment);

      if (
        !appointment ||
        appointment.host.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({
          message: "You cannot download this pass",
        });
      }
    }

    generatePassPDF(pass, res);
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate pass PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createPass,
  getPasses,
  getPassById,
  downloadPassPDF,
};
