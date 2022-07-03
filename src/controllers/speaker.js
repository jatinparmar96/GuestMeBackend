const Speaker = require('../models/speaker');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { generateHash, checkUrl } = require('../utils/utils');
// Auth Error
const AuthenticationError = require('../errors/AuthenticationError');
const {
  regSchema,
  logSchema,
  availabilitySchema,
} = require('../middleware/validation_speakerSchema');
const { s3, s3Bucket } = require('../utils/aws-service');

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
      res.status(200).send({ token, user: speaker });
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
  try {
    const { isInPerson, isOnline, priceMin, priceMax } = req.query;
    const areas = req.query?.areas?.split('_');
    const language = req.query?.language?.split('_');
    const locations = req.query?.location?.split('_');

    let query = {};
    let andQuery = [];

    if (isInPerson && !isOnline) {
      query['conditions.isInPerson'] = isInPerson ? true : false;
    }
    if (!isInPerson && isOnline) {
      query['conditions.isOnline'] = isOnline ? true : false;
    }

    if (priceMin || priceMax) {
      query['conditions.price'] = {
        $gte: priceMin ?? 0,
        $lte: priceMax ?? Infinity,
      };
    }

    if (areas && areas.length > 0) {
      let areasQuery = areas.map((area) => {
        return { 'conditions.areas': area };
      });
      andQuery.push({ $or: areasQuery });
    }

    if (language && language.length > 0) {
      let languageQuery = language.map((lang) => {
        return { 'conditions.language': lang };
      });
      andQuery.push({ $or: languageQuery });
    }

    if (locations && locations.length > 0) {
      let locationQuery = locations.map((location) => {
        return { location: location };
      });
      andQuery.push({ $or: locationQuery });
    }

    if (andQuery.length > 0) {
      query = { ...query, $and: andQuery };
    }

    const speakers = await Speaker.find(query)
      .populate('reviews')
      .populate('reviewsQuantity')
      .select(
        'fullName profilePicture location conditions firstName lastName tagline'
      )
      .limit(10)
      .exec()
      .catch((error) => res.status(500).json(error));

    const count = await Speaker.count(query);
    res.status(200).json({ speakers: speakers, count: count });
  } catch (error) {
    console.log('error: ', error);
    return next(error);
  }
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

  isUrl = checkUrl(userData.profilePicture);
  if (userData.profilePicture && !isUrl) {
    let fileName = new Date().getTime().toString();

    // If file already exists, replace data only
    if (user.profilePicture) {
      fileName = user.profilePicture.split('/').at(-1);
    }
    // Remove content Type from base64 string
    let imageData = Buffer.from(
      userData.profilePicture.replace(/^data:image\/\w+;base64,/, ''),
      'base64'
    );

    // S3 Params
    const s3Params = {
      Bucket: s3Bucket,
      Key: fileName,
      Expires: 3600,
      ContentEncoding: 'base64',
      ContentType: 'image/png',
      ACL: 'public-read',
      Body: imageData,
    };
    const response = await s3.upload(s3Params).promise();
    if (response) {
      userData.profilePicture = response.Location;
    }
  }

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
 * Get Speaker Availability
 * @param {*} req
 * @param {*} res
 *  URL -> /speakers/get-availability/:id
 */
exports.getSpeakerAvailability = async (req, res) => {
  const result = await availabilitySchema.validate(req.params);
  if (result.error) {
    return res.send(result.error);
  }
  const speaker = await Speaker.findById(result.value.id).select(
    'availability'
  );
  res.send(speaker?.availability || []);
};

/**
 *! GET SPEAKER
 *
 *  */
exports.getSpeaker = (req, res) => {
  Speaker.findOne({ _id: req.params.id })
    .populate('reviews')
    .populate('reviewsQuantity')
    .exec()
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((error) => res.status(500).json(error));
};

exports.getMaxPrice = async (req, res, next) => {
  const result = await Speaker.findOne({})
    .sort('-conditions.price')
    .select('conditions.price');
  res.status(200).json({ maxPrice: result?.conditions?.price || 0 });
};

/**
 *! GET SPEAKER BOOKINGS
 *
 *  */
exports.getSpeakerBookings = (req, res) => {
  Speaker.findOne({ _id: req.params.id })
    .populate('bookings')
    .select('bookings')
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => res.status(500).json(error));
};

/* * Get Random Speakers
 * For now Send a sample of 6 random speakers.
 *
 * @param  {} req
 * @param  {} res
 */
exports.getRandomSpeakers = async (req, res) => {
  // !To JSON object doesn't remove from aggregate queries
  // So unset the fields in the aggregate pipeline itself.
  const speakers = await Speaker.aggregate([
    { $sample: { size: 6 } },
    { $unset: ['credentials.password'] },
  ]);
  return res.json(speakers);
};
