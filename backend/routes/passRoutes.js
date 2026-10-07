const express = require("express");

const {
  createPass,
  getPasses,
  getPassById,
  downloadPassPDF,
} = require("../controllers/passController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createPass);

router.get("/", protect, getPasses);

router.get("/:id/pdf", protect, downloadPassPDF);

router.get("/:id", protect, getPassById);

module.exports = router;
