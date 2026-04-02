const express = require("express");
const router = express.Router();

const {
  createDoctorProfile,
  getAllDoctors,
  getDoctorById,
  setDoctorAvailability,
  getMyDoctorProfile,
  updateDoctorProfile
} = require("../controllers/doctorController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require ("../middleware/roleMiddleware");


// Create doctor profile (protected route)
router.post("/create-profile", authMiddleware,roleMiddleware(["doctor"]), createDoctorProfile);


// Get all doctors
router.get("/", getAllDoctors);

router.get("/my-profile",
  authMiddleware,
  roleMiddleware(["doctor"]),
  getMyDoctorProfile 
);

// Update doctor profile
router.patch("/my-profile", 
  authMiddleware, 
  roleMiddleware(["doctor"]), 
  updateDoctorProfile
);

// Get doctor by id
router.get("/:id", getDoctorById);

router.post(
  "/set-availability",
  authMiddleware,
  roleMiddleware(["doctor"]),
  setDoctorAvailability
);



module.exports = router;