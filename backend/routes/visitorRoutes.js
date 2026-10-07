const express = require("express");

const {
  createVisitor,
  getVisitors,
  getVisitorById,
  updateVisitor,
  deleteVisitor,
} = require("../controllers/visitorController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createVisitor);

router.get("/", protect, getVisitors);

router.get("/:id", protect, getVisitorById);

router.put("/:id", protect, updateVisitor);

router.delete("/:id", protect, deleteVisitor);

module.exports = router;