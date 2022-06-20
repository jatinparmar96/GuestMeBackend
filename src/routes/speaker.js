const express = require('express');
const router = express.Router();

const speakerController = require('../controllers/speaker');
const {
  SpeakerAuthMiddleware,
} = require('../middleware/SpeakerAuthentication');
router.post('/register', speakerController.register);

router.post('/login', speakerController.login);

//Update Speaker Profile
router.post(
  '/update/profile',
  SpeakerAuthMiddleware,
  speakerController.updateProfile
);

// Initially back 10 speakers

router.get('/', speakerController.getSpeakers);

// router.post('/update', speakerController.update);

module.exports = router;
