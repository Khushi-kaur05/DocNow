const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["doctor", "patient", "admin"],
      default: "patient"
    },
    phone: {
      type: String
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "male"
    },
    refreshToken:{
      type: String
    }
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

module.exports = mongoose.model("User", userSchema);