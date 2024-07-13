const { Schema, model } = require('mongoose');
const { hashSync, compareSync } = require('bcryptjs');
const jwt = require('jsonwebtoken');

const doctorSchema = new Schema({
  idCode: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  nezam: {
    type: String,
    required: true,
  },
  field: {
    type: String,
    required: true,
  },
  major: {
    type: String,
    enum: ['عمومی', 'متخصص', 'فوق تخصص'],
  },
  patients: [{
    type: Schema.Types.ObjectId,
    ref: 'Users'
  }],
  workDays: [
    { type: Number }
  ],
});

doctorSchema.methods = {
  hashPassword(password) {
    return hashSync(password);
  },
  authenticateUser(password) {
    return compareSync(password, this.password);
  },
  createToken(expiresIn) {
    return jwt.sign(
      {
        _id: this._id,
      },
      JWT_SECRET,
      { expiresIn },
    );
  },
  toAuthJSON(token) {
    return {
      _id: this._id,
      token: `JWT ${token}`,
    };
  },
  generateVerificationToken() {
    const verificationToken = jwt.sign({ _id: this._id }, JWT_SECRET, {
      expiresIn: '1m',
    });
    return verificationToken;
  },
  toPublicJSON() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      nezam: this.nezam,
      field: this.field,
      workDays: this.workDays,
    }
  }
};

module.exports = model('Doctors', doctorSchema, 'Doctors');
