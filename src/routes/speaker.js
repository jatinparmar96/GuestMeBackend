const express = require('express');
const router = express.Router({ mergeParams: true });

const {
  register,
  login,
  updateProfile,
  getSpeakers,
  getSpeaker,
  getMaxPrice,
  getRandomSpeakers,
} = require('../controllers/speaker');
const {
  SpeakerAuthMiddleware,
} = require('../middleware/SpeakerAuthentication');

router.post('/register', register);

router.post('/login', login);

//Update Speaker Profile
router.post('/update/profile', SpeakerAuthMiddleware, updateProfile);

// Get max price of speakers
router.get('/max-price', getMaxPrice);

// Initially back 10 speakers
router.get('/', getSpeakers);

//Get 5 random Speakers
router.get('/random-speakers', getRandomSpeakers);

// router.post('/update', speakerController.update);

// Get speaker by id
router.get('/:id', getSpeaker);

module.exports = router;
