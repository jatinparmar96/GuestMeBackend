const express = require('express');
const router = express.Router({ mergeParams: true });

const {
  register,
  login,
  updateProfile,
  getSpeakers,
  getSpeaker,
} = require('../controllers/speaker');
const {
  SpeakerAuthMiddleware,
} = require('../middleware/SpeakerAuthentication');

router.post('/register', register);

router.post('/login', login);

//Update Speaker Profile
router.post('/update/profile', SpeakerAuthMiddleware, updateProfile);

// Initially back 10 speakers

router.get('/', getSpeakers);

// router.post('/update', speakerController.update);

// Get speaker by id
router.get('/:id', getSpeaker);

module.exports = router;
