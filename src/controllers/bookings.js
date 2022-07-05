const Booking = require('../models/bookings');

const postBooking = (req, res) => {
  console.log(req.body);
  let booking = new Booking(req.body);
  booking.status = 'pending';

  booking
    .save()
    .then((result) => {
      res.status(201).json(booking);
    })
    .catch((error) => res.status(500).send(error));
};

const getBookings = (req, res) => {
  Booking.find({})
    .exec()
    .then((results) => {
      res.status(200).json(results);
    })
    .catch((error) => res.status(500).send(error));
};

const getBookingsBySpeakerId = (req, res) => {
  Booking.find({ speaker: { id: req.params.id } })
    .exec()
    .then((results) => {
      res.status(200).json(results);
    })
    .catch((error) => res.status(500).send(error));
};

module.exports = {
  getBookings,
  postBooking,
  getBookingsBySpeakerId,
};
