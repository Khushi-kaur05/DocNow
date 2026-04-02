const DoctorProfile = require("../models/DoctorProfile");
const User = require("../models/User");

const createDoctorProfile = async (req, res, next) => {
  try {
    const existing = await DoctorProfile.findOne({ userId: req.user.id });

    if (existing) {
      return res.status(400).json({ message: "Profile already exists" });
    }
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
    console.log("searching for specialization=============", specialization);
    if (specialization && specialization.trim() !== "") {
      filter.specialization = {
        $regex: specialization.trim(),
        $options: "i"
      };
    }
    const doctors = await DoctorProfile.find(filter)
      .populate("userId", "name email phone gender")
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
      .populate("userId", "name email gender");
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

const getMyDoctorProfile = async (req, res, next) => {
  try {
    const profile = await DoctorProfile.findOne({
      userId: req.user.id
    }).populate("userId", "name email phone gender");

    res.json(profile); // null if not exists
  } catch (error) {
    next(error);
  }
};

// ✅ Update doctor profile
const updateDoctorProfile = async (req, res, next) => {
  try {
    const { specialization, degree, experience, hospital, consultationFee, address, bio, gender } = req.body;

    // Update User gender if provided
    if (gender) {
      await User.findByIdAndUpdate(req.user.id, { gender }, { new: true });
    }

    const profile = await DoctorProfile.findOneAndUpdate(
      { userId: req.user.id },
      {
        specialization,
        degree,
        experience,
        hospital,
        consultationFee,
        address,
        bio
      },
      { new: true }
    ).populate("userId", "name email phone gender");

    if (!profile) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    res.json({
      message: "Profile updated successfully",
      doctor: profile
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDoctorProfile,
  getAllDoctors,
  getDoctorById,
  setDoctorAvailability,
  getMyDoctorProfile,
  updateDoctorProfile
};