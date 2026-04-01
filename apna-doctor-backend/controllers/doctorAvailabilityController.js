const DoctorAvailability = require("../models/DoctorAvailability");
const saveAvailability = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const { days, startTime, endTime, mode, isEmergencyAvailable } = req.body;

    const availability = await DoctorAvailability.findOneAndUpdate(
      { doctorId },
      { days, startTime, endTime, mode, isEmergencyAvailable },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Availability saved successfully",
      data: availability,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET availability of logged-in doctor
const getAvailability = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const availability = await DoctorAvailability.findOne({ doctorId });

    if (!availability) {
      return res.status(200).json(null); // no data case
    }

    // ✅ CLEAN RESPONSE
    res.status(200).json({
      days: availability.days || [],
      startTime: availability.startTime || "",
      endTime: availability.endTime || "",
      mode: availability.mode || [],
      isEmergencyAvailable: availability.isEmergencyAvailable || false,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getDoctorAvailabilityById = async (req , res) => {
  try {
    const doctorId = req.params.doctorId;
    const availability = await DoctorAvailability.findOne({doctorId});

    if (!availability){
      return res.json(null);
    }
     res.json({
      days: availability.days || [],
      startTime: availability.startTime || "",
      endTime: availability.endTime || "",
      mode: availability.mode || [],
      isEmergencyAvailable: availability.isEmergencyAvailable || false,
    });

    
  } catch(err){
    res.status(500).json({message:error.message})
  }
};

// ✅ export at end
module.exports = { saveAvailability, getAvailability, getDoctorAvailabilityById };