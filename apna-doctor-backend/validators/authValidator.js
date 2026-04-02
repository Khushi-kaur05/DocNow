const Joi = require("joi");

const registerSchema = Joi.object({

  name: Joi.string()
    .min(3)
    .required(),

  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .min(6)
    .required(),

  role: Joi.string()
    .valid("patient", "doctor")
    .required(),

  phone: Joi.string()
    .pattern(/^\d{10,15}$/)
    .required(),

  gender: Joi.string()
    .valid("male", "female", "other")
    .optional()

}).unknown(true);


const loginSchema = Joi.object({

  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .required()

});


module.exports = {
  registerSchema,
  loginSchema
};