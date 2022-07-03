const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * TODO: Change type data for organization when Organization collection created
 */
const reviewsSchema = new Schema({
  speakerID: {
    type: Schema.Types.ObjectId,
    ref: 'Speaker',
  },
  organization: mongoose.Schema({
    id: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  }),
  rating: {
    type: Number,
  },
  comment: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
});

reviewsSchema.set('timestamps', true);

module.exports = mongoose.model('Reviews', reviewsSchema);
