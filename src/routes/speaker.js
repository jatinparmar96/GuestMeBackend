const express = require('express');
const router = express.Router();

const speakerController = require('../controllers/speaker');

router.post('/signup', speakerController.signup);

router.post('/login', speakerController.login);

// Initially back 10 speakers
router.get('/', speakerController.getSpeakers);

// router.post('/update', speakerController.update);




module.exports = router;