const express = require("express");

const {
  checkInVisitor,
  checkOutVisitor,
  getCheckLogs,
} = require("../controllers/checkLogController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/check-in",
  protect,
  authorize("admin", "security"),
  checkInVisitor,
);

router.post(
  "/check-out",
  protect,
  authorize("admin", "security"),
  checkOutVisitor,
);

router.get("/", protect, authorize("admin", "security"), getCheckLogs);

module.exports = router;
