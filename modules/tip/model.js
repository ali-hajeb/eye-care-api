const { Schema, model } = require('mongoose');

const tipSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String
  },
  image: {
    type: String,
  },
}, { timestamps: true });


module.exports = model('Tips', tipSchema, 'Tips');