const express = require("express");
const router = express.Router();

const {
  bookAppointment,
  getDoctorAppointments,
  getPatientAppointments,
  getMyDoctorAppointments,
  completeAppointment,
  deleteAppointment,
  markAppointmentAsViewed
} = require("../controllers/appointmentController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require ("../middleware/roleMiddleware");


// Book appointment (auto-confirmed)
router.post("/book", authMiddleware, bookAppointment);

// Get doctor appointments (by doctorId)
router.get("/doctor/:doctorId", authMiddleware, getDoctorAppointments);

// Get logged-in doctor's appointments
router.get("/my-appointments", authMiddleware, roleMiddleware(["doctor"]), getMyDoctorAppointments);

// Get patient appointments (for logged-in user)
router.get("/patient", authMiddleware, getPatientAppointments);

// Mark appointment as viewed (remove red dot)
router.patch(
  "/view/:id",
  authMiddleware,
  markAppointmentAsViewed
);

// Complete appointment
router.patch(
  "/complete/:id",
  authMiddleware,
  roleMiddleware(["doctor"]),
  completeAppointment
);

// Cancel/Delete appointment
router.delete(
  "/cancel/:id",
  authMiddleware,
  deleteAppointment
);


module.exports = router;