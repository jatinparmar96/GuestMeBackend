const Joi = require('joi');

const regSchema = Joi.object({
  userName: Joi.string()
    .alphanum()
    .pattern(/^[a-zA-Z]+$/)
    .min(2)
    .max(30)
    .required(),
  userLastname: Joi.string()
    .alphanum()
    .pattern(/^[a-zA-Z]+$/)
    .min(2)
    .max(30)
    .required(),
  email: Joi.string().email({ minDomainSegments: 2 }).lowercase().required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.ref('password'),
});

const logSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).lowercase().required(),
  password: Joi.string().min(8).required(),
});

const availabilitySchema = Joi.object({
  id: Joi.string().required(),
});

module.exports = { regSchema, logSchema, availabilitySchema };
