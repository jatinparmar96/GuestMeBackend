const express = require('express');
const router = express.Router({ mergeParams: true });

const {
  register,
  login,
  updateProfile,
  getSpeakers,
  getSpeaker,
  getMaxPrice,
<<<<<<< HEAD
  getRandomSpeakers,
  getSpeakerAvailability,
=======
  getSpeakerBookings,
>>>>>>> 53d4aff (Add virtual methods to get bookings (organizations & speakers))
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

//Get 6 random Speakers
router.get('/random-speakers', getRandomSpeakers);

// router.post('/update', speakerController.update);

// Get Speaker Availability by id
router.get('/get-availability/:id?', getSpeakerAvailability);

// Get speaker by id
router.get('/:id', getSpeaker);

// Get speaker bookings
router.get('/bookings/:id', getSpeakerBookings);

module.exports = router;
