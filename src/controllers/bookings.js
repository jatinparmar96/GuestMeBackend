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

/**
 * @param  {} req
 * @param  {} res
 */
const setBookingStatus = (req, res) => {
  Booking.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { status: req.body.status } }
  )
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => res.status(500).send(error));
};

const getBookingsByMonth = async (req, res) => {
  // This should only fetch accepted Bookings but for demo this is fine.
  let bookings = await Booking.find().lean();

  const newBookings = bookings.reduce((acc, booking) => {
    const month = new Date(booking.bookingDateTime.date).getMonth();
    if (acc[month]) {
      acc[month] += 1;
    } else {
      acc[month] = 1;
    }
    return acc;
  }, {});
  let bookingsByMonth = [];
  for (let i = 0; i < 12; i++) {
    bookingsByMonth[i] = newBookings[i] || 0;
  }
  return res.json(bookingsByMonth);
};
module.exports = {
  getBookings,
  postBooking,
  getBookingsBySpeakerId,
  setBookingStatus,
  getBookingsByMonth,
};
