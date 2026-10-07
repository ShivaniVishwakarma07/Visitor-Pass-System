const CheckLog = require("../models/CheckLog");
const Pass = require("../models/Pass");

const checkInVisitor = async (req, res) => {
  try {
    const { passNumber } = req.body;

    if (!passNumber) {
      return res.status(400).json({
        message: "Pass number is required",
      });
    }

    const pass = await Pass.findOne({ passNumber }).populate("visitor");

    if (!pass) {
      return res.status(404).json({
        message: "Pass not found",
      });
    }

    if (pass.status !== "active") {
      return res.status(400).json({
        message: `Pass is ${pass.status}`,
      });
    }

    const now = new Date();

    if (now < pass.validFrom || now > pass.validUntil) {
      return res.status(400).json({
        message: "Pass is outside its validity period",
      });
    }

    const existingCheckIn = await CheckLog.findOne({
      pass: pass._id,
      action: "check-in",
    });

    const existingCheckOut = await CheckLog.findOne({
      pass: pass._id,
      action: "check-out",
    });

    if (existingCheckIn && !existingCheckOut) {
      return res.status(400).json({
        message: "Visitor is already checked in",
      });
    }

    const checkLog = await CheckLog.create({
      pass: pass._id,
      visitor: pass.visitor._id,
      action: "check-in",
      scannedBy: req.user._id,
    });

    res.status(201).json({
      message: "Visitor checked in successfully",
      checkLog,
      visitor: pass.visitor,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to check in visitor",
      error: error.message,
    });
  }
};

const checkOutVisitor = async (req, res) => {
  try {
    const { passNumber } = req.body;

    if (!passNumber) {
      return res.status(400).json({
        message: "Pass number is required",
      });
    }

    const pass = await Pass.findOne({ passNumber }).populate("visitor");

    if (!pass) {
      return res.status(404).json({
        message: "Pass not found",
      });
    }

    const lastCheckIn = await CheckLog.findOne({
      pass: pass._id,
      action: "check-in",
    }).sort({ timestamp: -1 });

    if (!lastCheckIn) {
      return res.status(400).json({
        message: "Visitor has not checked in",
      });
    }

    const lastCheckOut = await CheckLog.findOne({
      pass: pass._id,
      action: "check-out",
    }).sort({ timestamp: -1 });

    if (lastCheckOut && lastCheckOut.timestamp > lastCheckIn.timestamp) {
      return res.status(400).json({
        message: "Visitor is already checked out",
      });
    }

    const checkLog = await CheckLog.create({
      pass: pass._id,
      visitor: pass.visitor._id,
      action: "check-out",
      scannedBy: req.user._id,
    });

    pass.status = "used";
    await pass.save();

    res.status(201).json({
      message: "Visitor checked out successfully",
      checkLog,
      visitor: pass.visitor,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to check out visitor",
      error: error.message,
    });
  }
};

const getCheckLogs = async (req, res) => {
  try {
    const logs = await CheckLog.find()
      .populate("pass")
      .populate("visitor")
      .populate("scannedBy", "name email role")
      .sort({ timestamp: -1 });

    res.json(logs);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch check logs",
      error: error.message,
    });
  }
};

module.exports = {
  checkInVisitor,
  checkOutVisitor,
  getCheckLogs,
};
