const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const organizationSchema = new Schema({
  organizationName: {
    type: String,
  },
  about: {
    type: String,
  },
  profilePicture: {
    type: String,
  },
  address: {
    type: String,
  },
  postalCode: {
    type: String,
  },
  phone: {
    type: String,
  },
  contact: mongoose.Schema({
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
  }),
  credentials: mongoose.Schema({
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  }),
  savedSpeakers: mongoose.Schema({
    speakerID: {
       type: Schema.Types.ObjectId, ref: 'Speaker'
    },
    speakerName: {
      type: String,
    },
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
  }),
  notificationCount: ({
    type: Number
  })
});
organizationSchema.set('timestamps', true);

module.exports = mongoose.model('Organization', organizationSchema);