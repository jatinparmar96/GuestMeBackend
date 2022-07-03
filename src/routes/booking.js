const express = require('express');
const router = express.Router({ mergeParams: true });

const { getBookings, postBooking } = require('../controllers/bookings');

// Post booking
router.post('/', postBooking);

// Get all bookings
router.get('/', getBookings);

module.exports = router;
