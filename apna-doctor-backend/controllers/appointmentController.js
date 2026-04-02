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
    const { doctorId, date, time, patientName, patientAge, patientPhone, mode } = req.body;

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

    // ✅ Check if slot already booked (excluding cancelled appointments)
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date,
      time,
      status: { $ne: "cancelled" }
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
      patientName,
      patientAge,
      patientPhone,
      mode,
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
      .populate("patientId")
      .populate("doctorProfileId");

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
      .populate({
        path: "doctorId",
        select: "name email phone"
      })
      .populate({
        path: "doctorProfileId",
        select: "specialization degree experience hospital consultationFee"
      });

    res.json(appointments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get logged-in doctor appointments (sorted by new first)
const getMyDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment
      .find({ doctorId: req.user.id, status: { $ne: "cancelled" } })
      .populate("patientId")
      .populate("doctorProfileId")
      .sort({ isNew: -1, createdAt: -1 });

    res.json(appointments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Mark appointment as viewed (remove red dot)
const markAppointmentAsViewed = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { isNew: false },
      { new: true }
    );

    res.json({
      message: "Appointment marked as viewed",
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

// ✅ Cancel/Delete appointment
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    // Check if user is authorized to delete (must be patient or doctor of this appointment)
    if (appointment.patientId.toString() !== req.user.id && appointment.doctorId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to delete this appointment"
      });
    }

    // Update status to cancelled instead of deleting
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );

    res.json({
      message: "Appointment cancelled successfully",
      appointment: updatedAppointment
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  bookAppointment,
  getDoctorAppointments,
  getPatientAppointments,
  getMyDoctorAppointments,
  completeAppointment,
  deleteAppointment,
  markAppointmentAsViewed
};