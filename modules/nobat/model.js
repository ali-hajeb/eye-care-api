const { Schema, model } = require('mongoose');

const nobatSchema = new Schema({
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'Users'
  },
  doctor: {
    type: Schema.Types.ObjectId,
    ref: 'Doctors'
  },
  date: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
    default: 'PENDING'
  }
}, { timestamps: true });

// medSchema.methods = {
// };


module.exports = model('Nobat', nobatSchema, 'Nobat');
