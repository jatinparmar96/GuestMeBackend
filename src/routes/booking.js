const express = require('express');
const router = express.Router({ mergeParams: true });

const {
  getBookings,
  postBooking,
  setBookingStatus,
} = require('../controllers/bookings');

// Post booking
router.post('/', postBooking);

// Get all bookings
router.get('/', getBookings);

// Set Booking Availability
router.post('/set-booking/:id', setBookingStatus);

module.exports = router;
