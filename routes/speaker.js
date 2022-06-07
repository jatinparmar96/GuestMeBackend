const express = require('express');
const router = express.Router();


const speakerController = require('../controllers/speaker');

router.post('/signup', speakerController.signup);

router.post('/login', speakerController.login);

router.get('/speakers', speakerController.getSpeakers);

module.exports = router;