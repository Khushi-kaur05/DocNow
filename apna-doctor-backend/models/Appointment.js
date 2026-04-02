const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({

  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  
  doctorProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DoctorProfile",
    required: true
  },

  patientName: {
    type: String,
    required: true
  },

  patientAge: {
    type: Number
  },

  patientPhone: {
    type: String
  },

  mode: {
    type: String,
    enum: ["online", "offline"],
    required: true
  },

  date: {
    type: String,
    required: true
  },

  time: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["approved", "completed", "cancelled"],
    default: "approved"
  },

  isNew: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);