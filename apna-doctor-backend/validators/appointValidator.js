const Joi = require("joi");

const appointmentSchema = Joi.object({
  doctorId: Joi.string().required(),
  date: Joi.string().required(),
  time: Joi.string().required(),
  patientName: Joi.string().required(),
  patientAge: Joi.number(),
  patientPhone: Joi.string(),
  mode: Joi.string().valid("online", "offline").required()
});

module.exports = {
  appointmentSchema
};