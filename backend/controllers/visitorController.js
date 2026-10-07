const Visitor = require("../models/Visitor");

const createVisitor = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      purpose,
      idType,
      idNumber,
      address,
      photo,
      emergencyContact,
    } = req.body;

    if (!name || !email || !phone || !purpose || !idType || !idNumber) {
      return res.status(400).json({
        message: "Required visitor details are missing",
      });
    }

    const visitor = await Visitor.create({
      name,
      email,
      phone,
      company,
      purpose,
      idType,
      idNumber,
      address,
      photo,
      emergencyContact,
      registeredBy: req.user._id,
    });

    res.status(201).json({
      message: "Visitor registered successfully",
      visitor,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to register visitor",
      error: error.message,
    });
  }
};

const getVisitors = async (req, res) => {
  try {
    const { search, status } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    const visitors = await Visitor.find(filter)
      .populate("registeredBy", "name email role")
      .sort({ createdAt: -1 });

    res.json({
      count: visitors.length,
      visitors,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch visitors",
      error: error.message,
    });
  }
};

const getVisitorById = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id).populate(
      "registeredBy",
      "name email role",
    );

    if (!visitor) {
      return res.status(404).json({
        message: "Visitor not found",
      });
    }

    res.json({
      visitor,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch visitor",
      error: error.message,
    });
  }
};

const updateVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({
        message: "Visitor not found",
      });
    }

    const {
      name,
      email,
      phone,
      company,
      purpose,
      idType,
      idNumber,
      address,
      photo,
      emergencyContact,
      status,
    } = req.body;

    visitor.name = name ?? visitor.name;
    visitor.email = email ?? visitor.email;
    visitor.phone = phone ?? visitor.phone;
    visitor.company = company ?? visitor.company;
    visitor.purpose = purpose ?? visitor.purpose;
    visitor.idType = idType ?? visitor.idType;
    visitor.idNumber = idNumber ?? visitor.idNumber;
    visitor.address = address ?? visitor.address;
    visitor.photo = photo ?? visitor.photo;
    visitor.emergencyContact = emergencyContact ?? visitor.emergencyContact;
    visitor.status = status ?? visitor.status;

    await visitor.save();

    res.json({
      message: "Visitor updated successfully",
      visitor,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update visitor",
      error: error.message,
    });
  }
};

const deleteVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({
        message: "Visitor not found",
      });
    }

    await visitor.deleteOne();

    res.json({
      message: "Visitor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete visitor",
      error: error.message,
    });
  }
};

module.exports = {
  createVisitor,
  getVisitors,
  getVisitorById,
  updateVisitor,
  deleteVisitor,
};
