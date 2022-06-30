const Joi = require('joi');

const regSchema = Joi.object({
  organizationName: Joi.string()
    .alphanum()
    .pattern(/^[a-zA-Z]+$/)
    .min(2)
    .max(30)
    .required(),
  phone: Joi.string()
    .alphanum()
    .pattern(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)
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

module.exports = { regSchema, logSchema };
