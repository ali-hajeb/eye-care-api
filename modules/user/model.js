const { Schema, model } = require('mongoose');
const validator = require('validator');
const { hashSync, compareSync } = require('bcryptjs');
const { passwordReg, engLetterOnlyReg, iranPhoneNumberRegex } = require('../../utils');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'Firstname is required!'],
    trim: true,
    default: null,
  },
  lastName: {
    type: String,
    required: [true, 'Lastname is required!'],
    trim: true,
    default: null,
  },
  firstName_en: {
    type: String,
    // required: [true, 'Firstname is required!'],
    validate: {
      validator(fname) {
        return engLetterOnlyReg.test(fname);
      },
      message: 'English letters only!',
    },
    trim: true,
    default: null,
  },
  lastName_en: {
    type: String,
    // required: [true, 'Lastname is required!'],
    validate: {
      validator(fname) {
        return engLetterOnlyReg.test(fname);
      },
      message: 'English letters only!',
    },
    trim: true,
    default: null,
  },
  fatherName: {
    type: String,
    required: false,
  },
  weight: {
    type: Number,
    required: false,
    default: 0,
  },
  isMarried: {
    type: Boolean,
    required: false,
    default: false,
  },
  education: {
    type: Number,
    // enum: ['بی‌سواد', 'سیکل', 'دیپلم', 'فوق دیپلم', 'لیسانس', 'فوق لیسانس', 'دکترا و بالاتر']
    required: false,
    validate: {
      validator(n) {
        return n < 8 && n > -1
      },
      message: 'Education state must be between 0 - 7'
    },
    default: null,
  },
  job: {
    type: String,
    default: '',
    required: false,
  },
  immediateFamily: {
    type: String,
    default: '',
  },
  carerFname: {
    type: String,
    required: [false, 'Firstname is required!'],
    default: null,
  },
  carerLname: {
    type: String,
    required: [false, 'Lastname is required!'],
    default: null,
  },
  carerAge: {
    type: Number,
    required: [false, 'Age is required!'],
    default: null,
  },
  carerRel: {
    type: String,
    enum: ['فرزند', 'همسر', 'پدر یا مادر', 'پرستار', 'سایر'],
    required: false,
    default: null
  },
  carerEducation: {
    type: Number,
    // enum: ['بی‌سواد', 'سیکل', 'دیپلم', 'فوق دیپلم', 'لیسانس', 'فوق لیسانس', 'دکترا و بالاتر']
    required: false,
    validate: {
      validator(n) {
        return n < 8 && n > -1
      },
      message: 'Education state must be between 0 - 7'
    },
    default: null

  },
  carerGender: {
    type: Boolean,
    default: false
  },
  gender: {
    type: Boolean,
    default: false,
  },
  idCode: {
    type: String,
    unique: true,
    required: true,
  },
  isSmoker: {
    type: Boolean,
    required: false,
    default: false,
  },
  isAlcoholic: {
    type: Boolean,
    required: false,
    default: false,
  },
  allergy: {
    type: String,
    default: '',
  },
  hasDiabetes: {
    type: Boolean,
    required: false,
    default: false,
  },
  hasHTN: {
    type: Boolean,
    required: false,
    default: false,
  },
  hasEyeKer: {
    type: Boolean,
    required: false,
    default: false,
  },
  eyemh: {
    type: String,
    default: '',
  },
  drugHistory: {
    type: String,
    default: '',
  },
  tel: {
    validate: {
      validator(tel) {
        return iranPhoneNumberRegex.test(tel);
      },
      message: 'Telephone number is not valid!'
    },
    type: String,
    default: '',
  },
  birth: {
    type: Date,
    required: [false, 'Birth date is required!'],
    default: null
  },
  address: {
    type: String,
    required: [false, 'Address is required!'],
    default: null,
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
    default: null,
  },
  isActive: {
    type: Boolean,
    default: false,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password must be longer than 6 characters!'],
    validate: {
      validator(password) {
        return passwordReg.test(password);
      },
      message: '{VALUE} is not a valid password!',
    },
  },
  meds: [{
    type: Schema.Types.ObjectId,
    ref: 'Meds'
  }],
  nobat: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Nobat'
    }
  ]
});

userSchema.methods = {
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
  toJSON() {
    return {
      _id: this._id,
      firstName: this.firstName,
      lastName: this.lastName,
      firstName_en: this.firstName_en,
      lastName_en: this.lastName_en,
      fatherName: this.fatherName,
      gender: this.gender,
      weight: this.weight,
      age: this.age,
      birth: this.birth,
      idCode: this.idCode,
      isMarried: this.isMarried,
      education: this.education,
      job: this.job,
      tel: this.tel,
      address: this.address,
      email: this.email,
      meds: this.meds,
      isSmoker: this.isSmoker,
      isAlcoholic: this.isAlcoholic,
      hasDiabetes: this.hasDiabetes,
      hasHTN: this.hasHTN,
      hasEyeKer: this.hasEyeKer,
      allergy: this.allergy,
      eyemh: this.eyemh,
      drugHistory: this.drugHistory,
      nobat: this.nobat,
      immediateFamily: this.immediateFamily,
      carerFname: this.carerFname,
      carerLname: this.carerLname,
      carerAge: this.carerAge,
      carerRel: this.carerRel,
      carerEducation: this.carerEducation,
      carerGender: this.carerGender,
      isActive: this.isActive,
    };
  },
};

userSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = this.hashPassword(this.password);
  }
  if (this.isModified('email')) this.email = this.email.toLowerCase();
  return next();
});

module.exports = model('Users', userSchema, 'Users');
