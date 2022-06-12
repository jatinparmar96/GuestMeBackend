const express = require('express');
const router = express.Router();

const speakerController = require('../controllers/speaker');
const {
  SpeakerAuthMiddleware,
} = require('../middleware/SpeakerAuthentication');
router.post('/register', speakerController.register);

router.post('/login', speakerController.login);

// Initially back 10 speakers
/**
 * Only for Testing, Speaker Middleware from here will need to be removed.
 */
router.get(
  '/',
  speakerController.getSpeakers
);

// router.post('/update', speakerController.update);

module.exports = router;
