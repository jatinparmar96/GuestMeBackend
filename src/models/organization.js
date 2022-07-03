const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const Bookings = require('../models/bookings');

const organizationSchema = new Schema(
  {
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
        type: Schema.Types.ObjectId,
        ref: 'Speaker',
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
    notificationCount: {
      type: Number,
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform: function (doc, ret, options) {
        delete ret?.credentials?.password;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret, options) => {
        delete ret?.credentials?.password;
        return ret;
      },
    },
  }
);
organizationSchema.set('timestamps', true);

organizationSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.credentials.password);
  } catch (error) {
    throw error;
  }
};

organizationSchema.virtual('bookings', {
  ref: 'Bookings',
  localField: '_id',
  foreignField: 'organization.id',
});

module.exports = mongoose.model('Organization', organizationSchema);
