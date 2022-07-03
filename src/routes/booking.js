const express = require('express');
const router = express.Router({ mergeParams: true });

const { getBookings, postBooking } = require('../controllers/bookings');

router.post('/', postBooking);

router.get('/', getBookings);

module.exports = router;
