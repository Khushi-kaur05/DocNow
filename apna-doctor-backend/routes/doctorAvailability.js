const express = require("express");
const { saveAvailability, getAvailability } = require("../controllers/doctorAvailabilityController.js");
const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

// Save or update availability
router.post("/save", authMiddleware, saveAvailability);

// Get availability of logged-in doctor
router.get("/get", authMiddleware, getAvailability);

module.exports = router;