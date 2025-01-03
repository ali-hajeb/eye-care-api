const { Schema, model } = require('mongoose');
const validator = require('validator');
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
    unique: true,
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
  role: {
    type: String,
    enum: ['admin', 'u1'],
    default: 'u1'
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required!'],
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: '{VALUE} is not a valid email!',
    },
  },
  isActive: {
    type: Boolean,
    default: false
  },
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
    console.log('[token]: ', JWT_SECRET);
    const verificationToken = jwt.sign({ _id: this._id }, JWT_SECRET, {
      expiresIn: '720h',
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
      maxPatients: this.maxPatients,
      patients: this.patients,
      workDays: this.workDays,
      role: this.role,
      email: this.email,
      isActive: this.isActive,
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
      maxPatients: this.maxPatients,
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
