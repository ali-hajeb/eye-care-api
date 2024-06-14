const { Schema, model } = require('mongoose');

const medSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  fa: {
    type: String
  },
  interval: {
    type: Number,
    required: true,
  },
  intervalUnit: {
    type: String,
    enum: ['m', 'h'],
    required: true
  },
  usageHistory: [{
    date: Number,
    consumed: Boolean
  }],
});

// medSchema.methods = {
// };


module.exports = model('Meds', medSchema, 'Meds');
