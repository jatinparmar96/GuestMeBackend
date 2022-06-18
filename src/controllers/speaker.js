const bcrypt = require('bcrypt');
const Speaker = require('../models/speaker');
const jwt = require('jsonwebtoken');
const { generateHash } = require('../utils/utils');
// Auth Error
const AuthenticationError = require('../errors/AuthenticationError');

/**
 * Handle registration of speaker and send token back.
 * TODO:
 * Validation, If Speaker already exists respond with status code (409 Conflict or 422 Unprocessable Entity)
 * @param {import('express').Request<{}, {}, SpeakerRegisterRequestBody, {}>} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
exports.register = async (req, res, next) => {
  try {
    const { userName, userLastname, email, password, confirmPassword } =
      req.body;
    const readySpeaker = await Speaker.find({ 'credentials.email': email });
    if (readySpeaker.length > 0) {
      const error = new AuthenticationError(
        'This email has already been registered'
      );
      error.statusCode = 401;
      throw error;
    }

    if (password !== confirmPassword) {
      const error = new AuthenticationError('Passwords do not match');
      error.statusCode = 402;
      throw error;
    }

    const speaker = new Speaker({
      userName: userName,
      userLastname: userLastname,
      credentials: {
        email: email,
        password: await generateHash(password),
      },
      contact: {
        email: email,
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
    next(error);
  }
};

/**
 * Sign In the Speaker
 * TODO: Maybe Send user Object back without password included
 * @param {import('express').Request<{}, {}, SpeakerLoginRequestBody, {}>} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @return
 *
 */
exports.login = async (req, res, next) => {
  try {
    const { email } = req.body;
    const password = await generateHash(req.body.password ?? '');
    let speaker = await Speaker.findOne({ 'credentials.email': email });

    if (speaker === null) {
      const error = new AuthenticationError('Invalid credentials');
      console.log('error: ', error);
      error.statusCode = 404;
      throw error;
    }

    const valid = await bcrypt.compare(req.body.password, password);
    if (valid) {
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
    } else {
      const error = new AuthenticationError('Invalid credentials');
      error.statusCode = 404;
      throw error;
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/**
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
