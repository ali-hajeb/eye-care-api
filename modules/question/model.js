const { Schema, model } = require('mongoose');

const questionSchema = new Schema({
  from: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    enum: ['user', 'doctor'],
    required: true
  },
  alias: {
    type: String,
    default: 'کاربر'
  },
  replyTo: {
    type: Schema.Types.ObjectId,
    ref: 'Questions'
  },
  ticketId: {
    type: Schema.Types.ObjectId,
    ref: 'Ticket'
  },
  body: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// medSchema.methods = {
// };


module.exports = model('Questions', questionSchema, 'Questions');
