const express = require("express");

const {
  createPass,
  getPasses,
  getPassById,
} = require("../controllers/passController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createPass);

router.get("/", protect, getPasses);

router.get("/:id", protect, getPassById);

module.exports = router;
