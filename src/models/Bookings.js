const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingsSchema = new Schema({
  speaker: mongoose.Schema({
    id: {
      type: Schema.Types.ObjectId,
      ref: 'Speaker',
    },
    name: {
      type: String,
    },
  }),
  organization: mongoose.Schema({
    id: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
    },
    name: {
      type: String,
    },
  }),
  bookingDateTime: mongoose.Schema({
    startDateTime: {
      type: Date,
    },
    endDateTime: {
      type: String,
    },
  }),
  location: {
    type: String,
  },
  topic: {
    type: String,
  },
  message: {
    type: String,
  },
  status: {
    type: String,
    enum: ['accepted', 'rejected', 'pending'],
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
  personInCharge: {
    type: String,
  },
  deliveryMethod: {
    type: String,
    enum: ['isInPerson', 'isOnline'],
  },
});
bookingsSchema.set('timestamps', true);
module.exports = mongoose.model('Bookings', bookingsSchema);
