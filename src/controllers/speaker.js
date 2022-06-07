const Speaker = require('../models/speaker');

exports.signup = async (req, res, next) => {};

exports.login = async (req, res, next) => {};

// req will take parameters
exports.getSpeakers = async (req, res, next) => {
  const speakers = await Speaker.find({});
  const speaker = new Speaker({ name: 'John Doe' });

  speakers.push(speaker);
  res.json(speakers);
};