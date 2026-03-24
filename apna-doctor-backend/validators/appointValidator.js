const Joi = require("joi");

const appointmentSchema = Joi.object({
  doctorId: Joi.string().required(),
  date: Joi.string().required(),
  time: Joi.string().required()
});

module.exports = {
  appointmentSchema
};