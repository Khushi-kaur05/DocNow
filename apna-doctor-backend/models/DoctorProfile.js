const mongoose = require("mongoose");

const doctorProfileSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  specialization: {
    type: String,
    required: true
  },

  degree: {
    type: String
  },

  experience: {
    type: Number
  },

  hospital: {
    type: String
  },

  consultationFee: {
    type: Number
  },

  availableDays: [String],

  availableTimeSlots: [
    {
      day: String,
      startTime: String,
      endTime: String
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model("DoctorProfile", doctorProfileSchema);