const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const Reviews = require('../models/reviews');
const Bookings = require('../models/bookings');

const speakerSchema = new Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    location: {
      type: String,
    },
    tagLine: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
    skills: {
      type: [String],
    },
    videos: {
      type: String,
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
    notificationCount: {
      type: Number,
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
      price: {
        type: Number,
      },
      areas: {
        type: [String],
      },
      language: {
        type: [String],
      },
    }),
  },
  {
    toJSON: { virtuals: true },
    toObject: { virutals: true },
  }
);
speakerSchema.set('timestamps', true);

speakerSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.credentials.password);
  } catch (error) {
    throw error;
  }
};

speakerSchema.virtual('reviews', {
  ref: 'Reviews',
  localField: '_id',
  foreignField: 'speakerID',
});

speakerSchema.virtual('reviewsQuantity', {
  ref: 'Reviews',
  localField: '_id',
  foreignField: 'speakerID',
  count: true,
});

speakerSchema.virtual('fullName').get(function () {
  return this.firstName + ' ' + this.lastName;
});

speakerSchema.virtual('bookings', {
  ref: 'Bookings',
  localField: '_id',
  foreignField: 'speaker.id',
});
const Speaker = mongoose.model('Speaker', speakerSchema);
module.exports = Speaker;
