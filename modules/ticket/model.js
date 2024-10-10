const { Schema, model } = require('mongoose');

const ticketSchema = new Schema({
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'Users'
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  messages: [{
    type: Schema.Types.ObjectId,
    ref: 'Questions'
  }]
}, { timestamps: true });

// medSchema.methods = {
// };


module.exports = model('Ticket', ticketSchema, 'Ticket');
