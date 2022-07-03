const Booking = require('../models/bookings');

const postBooking = (req, res) => {
  let booking = new Booking({
    speaker: {
      id: req.body.id,
      name: req.body.name,
    },
    organization: {
      id: req.body.id,
      name: req.body.name,
    },
    bookingDateTime: {
      startDateTime: req.body.startDateTime,
      endDateTime: req.body.endDateTime,
    },
    location: req.body.location,
    topic: req.body.topic,
    message: req.body.message,
    status: 'pending',
    personInCharge: req.body.personInCharge,
    deliveryMethod: req.body.deliveryMethod,
  });

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

module.exports = {
  getBookings,
  postBooking,
};
