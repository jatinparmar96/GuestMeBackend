const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const speakerSchema = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  location: {
    type: String,
  },
  profilePicture: {
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
  conditions: mongoose.Schema({
    isInPerson: {
      type: Boolean,
    },
    isOnline: {
      type: Boolean,
    },
    rate: {
      type: Number,
    },
    areas: {
      type: [String],
    },
    interests: {
      type: [String],
    },
    videos: {
      type: [String],
    },
    certifications: {
      type: [String],
    },
    about: {
      type: String,
    },
    availability: {
      type: [Date],
    },
    language: {
      type: [String],
    },
    notificationCount: {
      type: Number,
    },
  }),
});

module.exports = mongoose.model('Speaker', speakerSchema);
