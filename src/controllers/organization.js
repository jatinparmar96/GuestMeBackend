const Organization = require('../models/organization');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { generateHash } = require('../utils/utils');
// Auth Error
const AuthenticationError = require('../errors/AuthenticationError');
const {
  regSchema,
  logSchema,
} = require('../middleware/validation_organizationSchema');

/**
 *! Register Organization
 * Handle registration of organization and send token back.
 * TODO:
 * Validation, If Organization already exists respond with status code (409 Conflict or 422 Unprocessable Entity)
 * @param {import('express').Request<{}, {}, OrganizationRegisterRequestBody, {}>} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
exports.register = async (req, res, next) => {
  try {
    const result = await regSchema.validateAsync(req.body);

    const readyOrganization = await Organization.find({
      'credentials.email': result.email,
    });
    if (readyOrganization.length > 0) {
      const error = new AuthenticationError(
        `${result.email} has already been registered`
      );
      error.statusCode = 401;
      throw error;
    }

    const organization = new Organization({
      organizationName: result.organizationName,
      phone: result.phone,
      credentials: {
        email: result.email,
        password: await generateHash(result.password),
      },
      contact: {
        email: result.email,
      },
    });

    await organization.save();

    //? By default the token expires in 30 days
    const token = jwt.sign(
      { name: organization.name, id: organization._id },
      process.env.JWT_SECRET_ACCESS,
      { expiresIn: '30 days' }
    );
    res.status(200).send({
      organization,
      token,
    });
  } catch (error) {
    if (error.isJoi === true)
      return next(createError.UnprocessableEntity(error.message));

    next(error);
  }
};

/**
 *! Sign In the Organization
 * TODO: Maybe Send user Object back without password included
 * @param {import('express').Request<{}, {}, OrganizationLoginRequestBody, {}>} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @return
 *
 */
exports.login = async (req, res, next) => {
  try {
    const result = await logSchema.validateAsync(req.body);
    // const password = await generateHash(req.body.password ?? '');
    let organization = await Organization.findOne({
      'credentials.email': result.email,
    });

    if (!organization) {
      throw createError.NotFound('User not registered');
    }

    const valid = await organization.isValidPassword(result.password);
    if (!valid) throw createError.Unauthorized('Username/password not valid');
    else {
      const token = jwt.sign(
        { email: organization.credentials.email, id: organization._id },
        process.env.JWT_SECRET_ACCESS,
        { expiresIn: '30 days' }
      );
      /**
       * For now only send token, until we find a better way to mutate user object to remove
       * password field
       */
      res.status(200).send({ token, user: organization });
    }
  } catch (error) {
    if (error.isJoi === true)
      return next(createError.BadRequest('Invalid Username/Password'));
    console.error(error);

    next(error);
  }
};

/**
 * @typedef {import('./organization.controller').OrganizationRegisterRequestBody} OrganizationRegisterRequestBody
 * @typedef {import('./organization.controller').OrganizationLoginRequestBody} OrganizationLoginRequestBody
 */

/**
 *! GET ORGANIZATION BOOKINGS
 *
 *  */
exports.getOrganizationBookings = (req, res) => {
  Organization.findOne({ _id: req.params.id })
    .populate('bookings')
    .select('bookings')
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => res.status(500).json(error));
};
