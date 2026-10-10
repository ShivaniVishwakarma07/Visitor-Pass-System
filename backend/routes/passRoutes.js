const express = require("express");

const {
  createPass,
  getPasses,
  getPassById,
  downloadPassPDF,
} = require("../controllers/passController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, authorize("admin", "security"), createPass);

router.get("/", protect, authorize("admin", "security", "employee"), getPasses);

router.get(
  "/:id/pdf",
  protect,
  authorize("admin", "security", "employee"),
  downloadPassPDF,
);

router.get(
  "/:id",
  protect,
  authorize("admin", "security", "employee"),
  getPassById,
);

module.exports = router;
