const bcrypt = require('bcrypt');
const Speaker = require('../models/speaker');
const jwt = require('jsonwebtoken');
/**
 * Handle registration of speaker and send token back.
 * @param {Speaker} req
 * @param {*} res
 * @param {*} next
 */
exports.register = async (req, res, next) => {
  const speaker = new Speaker(req.body);

  //10 Rounds is enough for our app
  const salt = await bcrypt.genSalt(10);
  //Generate Password HASH
  speaker.password = await bcrypt.hash(
    speaker.password,
    salt
  );
  await speaker.save();

  //? By default the token expires in 30 days
  const token = jwt.sign(
    { name: speaker.name },
    process.env.JWT_SECRET_ACCESS,
    { expiresIn: '30 days' }
  );
  res.status(200).send({
    speaker,
    token,
  });
};

/**
 * Sign In the Speaker
 * @return
 *
 */
exports.login = async (req, res, next) => {};

// req will take parameters
exports.getSpeakers = async (req, res, next) => {
  const speakers = await Speaker.find({});
  const speaker = new Speaker({ name: 'John Doe' });

  speakers.push(speaker);
  res.json(speakers);
};
