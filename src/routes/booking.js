const express = require('express');
const router = express.Router({ mergeParams: true });

const {
  getBookings,
  postBooking,
  setBookingStatus,
  getBookingsByMonth,
} = require('../controllers/bookings');

// Post booking
router.post('/', postBooking);

// Get all bookings
router.get('/', getBookings);

// Set Booking Availability
router.post('/set-booking/:id', setBookingStatus);

router.get('/all-bookings-by-month', getBookingsByMonth);

module.exports = router;
