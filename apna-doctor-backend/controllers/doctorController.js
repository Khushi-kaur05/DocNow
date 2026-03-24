const DoctorProfile = require("../models/DoctorProfile");

const createDoctorProfile = async (req, res, next) => {
  try {
    const doctor = await DoctorProfile.create({
      userId: req.user.id,
      specialization: req.body.specialization,
      degree: req.body.degree,
      experience: req.body.experience,
      hospital: req.body.hospital,
      consultationFee: req.body.consultationFee,
      availableDays: req.body.availableDays
    });
    res.status(201).json({
      message: "Doctor profile created",
      doctor
    });
  } catch (error) {
    next(error);
  }
};

const getAllDoctors = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const specialization = req.query.specialization;
    let filter = {};
    if (specialization) {
      filter.specialization = specialization;
    }
    const doctors = await DoctorProfile.find(filter)
      .populate("userId", "name email phone")
      .skip(skip)
      .limit(limit);
    const totalDoctors = await DoctorProfile.countDocuments(filter);
    res.json({
      page,
      totalDoctors,
      totalPages: Math.ceil(totalDoctors / limit),
      doctors
    });
  } catch (error) {
    next(error);
  }
};

const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await DoctorProfile
      .findById(req.params.id)
      .populate("userId", "name email");
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json(doctor);
  } catch (error) {
    next(error);
  }
};

const setDoctorAvailability = async (req, res, next) => {
  try {
    const { availableTimeSlots } = req.body;
    const doctor = await DoctorProfile.findOneAndUpdate(
      { userId: req.user.id },
      { availableTimeSlots },
      { new: true }
    );
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json({
      message: "Availability updated successfully",
      doctor
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDoctorProfile,
  getAllDoctors,
  getDoctorById,
  setDoctorAvailability
};