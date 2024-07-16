const { Schema, model } = require('mongoose');
const { hashSync, compareSync } = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

const doctorSchema = new Schema({
  idCode: {
    type: String,
    unique: true,
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
  gender: {
    type: Boolean,
    required: false,
  },
  maxPatients: {
    type: Number,
    default: 20
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
  authenticateDoctor(password) {
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
  toJSON() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      gender: this.gender,
      idCode: this.idCode,
      nezam: this.nezam,
      major: this.major,
      field: this.field,
      patients: this.patients,
      workDays: this.workDays,
    }
  },
  toPublicJSON() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      gender: this.gender,
      nezam: this.nezam,
      major: this.major,
      field: this.field,
      workDays: this.workDays,
    }
  }
};

doctorSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = this.hashPassword(this.password);
  }
  return next();
});


module.exports = model('Doctors', doctorSchema, 'Doctors');
