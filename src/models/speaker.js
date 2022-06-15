const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const speakerSchema = new Schema({
  userName: {
    type: String,
  },
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
});

module.exports = mongoose.model('Speaker', speakerSchema);
