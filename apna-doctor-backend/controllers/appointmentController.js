const Appointment = require("../models/Appointment");
const DoctorProfile = require("../models/DoctorProfile");
const DoctorAvailability = require("../models/DoctorAvailability");
const { appointmentSchema } = require("../validators/appointValidator");

// 🔥 Convert "5:00 PM" → 17
const convertToNumber = (timeStr) => {
  const [time, modifier] = timeStr.split(" ");
  let [hours] = time.split(":");

  hours = parseInt(hours);

  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  }

  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  return hours;
};

const bookAppointment = async (req, res) => {
  const { error } = appointmentSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message
    });
  }

  try {
    const { doctorId, date, time } = req.body;

    // ✅ Check if doctor exists
    const doctor = await DoctorProfile.findOne({ userId: doctorId });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found"
      });
    }

    // ✅ Get doctor's availability (SINGLE SOURCE OF TRUTH)
    const availability = await DoctorAvailability.findOne({ doctorId });

    if (!availability) {
      return res.status(400).json({
        message: "Doctor availability not set"
      });
    }

    // ✅ Convert time to number
    const timeNumber = convertToNumber(time);

    const start = Number(availability.startTime);
    const end = Number(availability.endTime);

    // ✅ Check if time is within range
    if (timeNumber < start || timeNumber >= end) {
      return res.status(400).json({
        message: "Doctor not available at this time slot"
      });
    }

    // ✅ Check if slot already booked
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date,
      time
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: "Slot already booked"
      });
    }

    // ✅ Create appointment
    const appointment = await Appointment.create({
      patientId: req.user.id,
      doctorId,
      doctorProfileId: doctor._id,
      date,
      time
    });

    res.json({
      message: "Appointment booked successfully",
      appointment
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// ✅ Get all appointments for a doctor
const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment
      .find({ doctorId: req.params.doctorId })
      .populate("patientId");

    res.json(appointments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get logged-in patient appointments
const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment
      .find({ patientId: req.user.id })
      .populate("doctorId");

    res.json(appointments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Approve appointment
const approveAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    res.json({
      message: "Appointment approved",
      appointment
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Reject appointment
const rejectAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    res.json({
      message: "Appointment rejected",
      appointment
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Complete appointment
const completeAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "completed" },
      { new: true }
    );

    res.json({
      message: "Appointment completed",
      appointment
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  bookAppointment,
  getDoctorAppointments,
  getPatientAppointments,
  approveAppointment,
  rejectAppointment,
  completeAppointment
};