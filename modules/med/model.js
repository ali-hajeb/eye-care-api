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
  intervalType: {
    type: String,
    enum: ['m', 'h'],
    required: true
  },
  startFrom: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    enum: ['قرص', 'قطره', 'پماد', 'کپسول', 'شربت', 'تزریق', 'سایر'],
    required: true,
    default: 'سایر'
  },
  id: {
    type: String,
    unique: true,
    required: true
  },
  usageHistory: [{
    date: Number,
    consumed: Boolean
  }],
  isActive: {
    type: boolean,
    default: true,
  }
});

// medSchema.methods = {
// };


module.exports = model('Meds', medSchema, 'Meds');
