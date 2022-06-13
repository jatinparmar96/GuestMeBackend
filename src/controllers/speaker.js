const bcrypt = require('bcrypt');
const Speaker = require('../models/speaker');
const jwt = require('jsonwebtoken');
const { generateHash } = require('../utils/utils');
/**
 * Handle registration of speaker and send token back.
 * TODO:
 * Validation, If Speaker already exists respond with status code (409 Conflict or 422 Unprocessable Entity)
 * @param {Speaker} req
 * @param {*} res
 * @param {*} next
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
      userName,
      credentials: {
        email: email,
        password: await generateHash(password),
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
 * @return
 *
 */
exports.login = async (req, res, next) => {
  const password = await generateHash(
    req.body.password ?? ''
  );
  let user = await Speaker.findOne({
    name: req.body.name,
  });
  const valid = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (valid) {
    const token = jwt.sign(
      { name: user.name, id: user._id },
      process.env.JWT_SECRET_ACCESS,
      { expiresIn: '30 days' }
    );
    /**
     * For now only send token, until we find a better way to mutate user object to remove
     * password field
     */
    res.status(200).send({ token });
  } else {
    res.status(404).send();
  }
};

/**
 * TODO: req will take parameters -> limit, offset, all
 *  */
exports.getSpeakers = async (req, res, next) => {
  const speakers = await Speaker.find({});
  res.json(speakers);
};
