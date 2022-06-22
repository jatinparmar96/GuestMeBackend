const Speaker = require('../models/speaker');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { generateHash } = require('../utils/utils');
// Auth Error
const AuthenticationError = require('../errors/AuthenticationError');
const {
  regSchema,
  logSchema,
} = require('../middleware/validation_speakerSchema');
const { restart } = require('nodemon');

/**
 *! Register Speaker
 * Handle registration of speaker and send token back.
 * TODO:
 * Validation, If Speaker already exists respond with status code (409 Conflict or 422 Unprocessable Entity)
 * @param {import('express').Request<{}, {}, SpeakerRegisterRequestBody, {}>} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
exports.register = async (req, res, next) => {
  try {
    const result = await regSchema.validateAsync(req.body);

    const readySpeaker = await Speaker.find({
      'credentials.email': result.email,
    });
    if (readySpeaker.length > 0) {
      const error = new AuthenticationError(
        `${result.email} has already been registered`
      );
      error.statusCode = 401;
      throw error;
    }

    const speaker = new Speaker({
      userName: result.userName,
      userLastname: result.userLastname,
      credentials: {
        email: result.email,
        password: await generateHash(result.password),
      },
      contact: {
        email: result.email,
      },
    });

    await speaker.save();

    //? By default the token expires in 30 days
    const token = jwt.sign(
      { name: speaker.name, id: speaker._id },
      process.env.JWT_SECRET_ACCESS,
      { expiresIn: '30 days' }
    );
    res.status(200).send({
      speaker,
      token,
    });
  } catch (error) {
    if (error.isJoi === true)
      return next(createError.UnprocessableEntity(error.message));

    next(error);
  }
};

/**
 *! Sign In the Speaker
 * TODO: Maybe Send user Object back without password included
 * @param {import('express').Request<{}, {}, SpeakerLoginRequestBody, {}>} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @return
 *
 */
exports.login = async (req, res, next) => {
  try {
    const result = await logSchema.validateAsync(req.body);
    // const password = await generateHash(req.body.password ?? '');
    let speaker = await Speaker.findOne({ 'credentials.email': result.email });

    if (!speaker) {
      throw createError.NotFound('User not registered');
    }

    const valid = await speaker.isValidPassword(result.password);
    if (!valid) throw createError.Unauthorized('Username/password not valid');
    else {
      const token = jwt.sign(
        { email: speaker.credentials.email, id: speaker._id },
        process.env.JWT_SECRET_ACCESS,
        { expiresIn: '30 days' }
      );
      /**
       * For now only send token, until we find a better way to mutate user object to remove
       * password field
       */
      res.status(200).send({ token });
    }
  } catch (error) {
    if (error.isJoi === true)
      return next(createError.BadRequest('Invalid Username/Password'));
    console.error(error);

    next(error);
  }
};

/**
 *! GET SPEAKERS
 * TODO: req will take parameters -> limit, offset, all
 *  */
exports.getSpeakers = async (req, res, next) => {
  const speakers = await Speaker.find({});
  res.json(speakers);
};
/**
 * @typedef {import('./speaker.controller').SpeakerRegisterRequestBody} SpeakerRegisterRequestBody
 * @typedef {import('./speaker.controller').SpeakerLoginRequestBody} SpeakerLoginRequestBody
 */

/**
 *! Update Speaker Profile
 * TODO: Add Validation to data
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.updateProfile = async (req, res, next) => {
  const user = await Speaker.findById(req.authToken.id);
  const userData = req.body;

  console.log(req.body);
  // Don't allow to update password through here.
  if (userData.password) {
    delete userData.password;
  }
  Object.keys(userData).forEach((key) => {
    user[key] = userData[key];
  });

  await user.save();
  res.json(user);
};

/**
 *! GET SPEAKER
 * TODO: Add review count and check conditons subcollection
 *  */
exports.getSpeaker = (req, res) => {
  Speaker.findOne({ _id: req.params.id })
    .populate('reviews')
    .populate('reviewsQuantity')
    .select('firstName lastName profilePicture location conditions')
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => res.status(500).json(error));
};
