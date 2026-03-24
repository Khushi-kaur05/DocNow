const express = require("express");
const router = express.Router();

const {
  createDoctorProfile,
  getAllDoctors,
  getDoctorById,
  setDoctorAvailability
} = require("../controllers/doctorController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require ("../middleware/roleMiddleware");


// Create doctor profile (protected route)
router.post("/create-profile", authMiddleware,roleMiddleware(["doctor"]), createDoctorProfile);


// Get all doctors
router.get("/", getAllDoctors);


// Get doctor by id
router.get("/:id", getDoctorById);

router.post(
  "/set-availability",
  authMiddleware,
  roleMiddleware(["doctor"]),
  setDoctorAvailability
);


module.exports = router;