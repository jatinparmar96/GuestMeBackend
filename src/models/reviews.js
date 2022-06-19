const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewsSchema = new Schema({
  speakerID: {
    type: Schema.Types.ObjectId, ref: 'Speaker'
  },
  organizationID: {
    type: Schema.Types.ObjectId, ref: 'Organization'
  },
  rating: {
    type: Number,
  },
  comment: ({
    type: String,
  }),
  createdAt: ({
    type: Date
  }),
  updatedAt: ({
    type:Date
  }),
});

module.exports = mongoose.model('Reviews', reviewsSchema);