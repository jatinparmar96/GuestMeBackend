const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const bookingsSchema = new Schema({
  speaker: mongoose.Schema({
    id: {
      type: Schema.Types.ObjectId, ref: 'Speaker',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  }),
  organization: mongoose.Schema({
    id: {
      type: Schema.Types.ObjectId, ref: 'Organization',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  }),
  bookingDateTime: mongoose.Schema({
    startDateTime: {
      type: Date,
      required: true,
    },
    endDateTime: {
      type: String,
      required: true,
    },
  }),
  location: ({
    type: String
  }),
  topic: ({
    type: String
  }),
  message: ({
    type: String
  }),
  status: ({
    type: String
  }),
  createdAt: ({
    type: Date
  }),
  updatedAt: ({
    type: Date
  }),
  personInCharge: ({
    type: String
  }),
  deliveryMethod: ({
    type: String,
    enum: ['isInPerson','isOnline']
  })
});
bookingsSchema.set('timestamps', true);
module.exports = mongoose.model('Bookings', bookingsSchema);
