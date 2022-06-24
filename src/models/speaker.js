const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

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

speakerSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.credentials.password);
  } catch (error) {
    throw error;
  }
};

const Speaker = mongoose.model('Speaker', speakerSchema);
module.exports = Speaker;
