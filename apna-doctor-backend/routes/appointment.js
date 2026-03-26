const express = require("express");
const router = express.Router();

const {
  bookAppointment,
  getDoctorAppointments,
  getPatientAppointments,
  approveAppointment,
  rejectAppointment,
  completeAppointment
} = require("../controllers/appointmentController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require ("../middleware/roleMiddleware");


// Book appointment
router.post("/book", authMiddleware, bookAppointment);


// Get doctor appointments
router.get("/doctor/:doctorId", authMiddleware, getDoctorAppointments);


// Get patient appointments
router.get("/patient", authMiddleware, getPatientAppointments);

router.patch(
  "/approve/:id",
  authMiddleware,
  roleMiddleware(["doctor"]),
  approveAppointment
);

router.patch(
  "/reject/:id",
  authMiddleware,
  roleMiddleware(["doctor"]),
  rejectAppointment
);

router.patch(
  "/complete/:id",
  authMiddleware,
  roleMiddleware(["doctor"]),
  completeAppointment
);


module.exports = router;