const Appointment = require("../models/Appointment");
const DoctorProfile = require ("../models/DoctorProfile");
const { appointmentSchema } = require("../validators/appointValidator");


const bookAppointment = async (req, res) => {
    const { error } = appointmentSchema.validate(req.body);

    if (error) {
    return res.status(400).json({
        message: error.details[0].message
    });
    }

  try {

    const { doctorId, date, time } = req.body;

    //check if doctor exists
    const doctor = await DoctorProfile.findOne({ userId: doctorId });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found"
      });
    }

    //  check if slot exists in doctor availability
    const slotExists = doctor.availableTimeSlots.some(
      slot => `${slot.startTime} - ${slot.endTime}` === time
    );

    if (!slotExists) {
      return res.status(400).json({
        message: "Doctor not available at this time"
      });
    }

    //  check if slot already booked
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

    // create appointment
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