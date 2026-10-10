const express = require("express");

const {
  createVisitor,
  getVisitors,
  getVisitorById,
  updateVisitor,
  deleteVisitor,
} = require("../controllers/visitorController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("admin", "security", "employee"),
  createVisitor,
);

router.get(
  "/",
  protect,
  authorize("admin", "security", "employee"),
  getVisitors,
);

router.get(
  "/:id",
  protect,
  authorize("admin", "security", "employee"),
  getVisitorById,
);

router.put("/:id", protect, authorize("admin"), updateVisitor);

router.delete("/:id", protect, authorize("admin"), deleteVisitor);

module.exports = router;
