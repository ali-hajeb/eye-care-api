const { Schema, model } = require('mongoose');
const validator = require('validator');
const { hashSync, compareSync } = require('bcryptjs');
const { passwordReg, engLetterOnlyReg, mobilePhoneRegex } = require('../../utils');
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
    required: [true, 'Firstname is required!'],
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
    required: [true, 'Lastname is required!'],
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
    required: true,
  },
  weight: {
    type: Number,
    required: true,
    default: 75
  },
  isMarried: {
    type: Boolean,
    required: true,
    default: false,
  },
  education: {
    type: Number,
    // enum: ['بی‌سواد', 'سیکل', 'دیپلم', 'فوق دیپلم', 'لیسانس', 'فوق لیسانس', 'دکترا و بالاتر']
    required: true,
    validate: {
      validator(n) {
        return n < 8 && n > -1
      },
      message: 'Education state must be between 0 - 7'
    }
  },
  job: {
    type: String,
    required: true,
  },
  immediateFamily: {
    type: String,
  },
  carerFname: {
    type: String,
    required: [true, 'Firstname is required!'],
    trim: true,
    default: null,
  },
  carerLname: {
    type: String,
    required: [true, 'Lastname is required!'],
    trim: true,
    default: null,
  },
  carerAge: {
    type: Number,
    required: [true, 'Age is required!'],
    trim: true,
    default: null,
  },
  carerRel: {
    type: String,
    enum: ['فرزند', 'همسر', 'پدر', 'مادر', 'پرستار', 'سایر'],
    required: true
  },
  carerEducation: {
    type: Number,
    // enum: ['بی‌سواد', 'سیکل', 'دیپلم', 'فوق دیپلم', 'لیسانس', 'فوق لیسانس', 'دکترا و بالاتر']
    required: true,
    validate: {
      validator(n) {
        return n < 8 && n > -1
      },
      message: 'Education state must be between 0 - 7'
    }
  },
  carerGender: {
    type: Boolean,
    required: true,
  },
  gender: {
    type: Boolean,
    required: true,
  },
  idCode: {
    type: String,
    required: true,
  },
  isSmoker: {
    type: Boolean,
    required: true,
    default: false,
  },
  isAlcoholic: {
    type: Boolean,
    required: true,
    default: false,
  },
  allergy: {
    type: String,
    required: true,
  },
  hasDiabetes: {
    type: Boolean,
    required: true,
    default: false,
  },
  hasHTN: {
    type: Boolean,
    required: true,
    default: false,
  },
  hasEyeKer: {
    type: Boolean,
    required: true,
    default: false,
  },
  eyemh: {
    type: String,
    required: true,
  },
  drugHistory: [{
    type: String,
    required: true,
  }],
  tel: {
    required: [true, 'Telephone number is required!'],
    validate: {
      validator(tel) {
        return mobilePhoneRegex.test(tel);
      },
      message: 'Telephone number is not valid!'
    },
    type: String,
  },
  birth: {
    type: Date,
    required: [true, 'Birth date is required!']
  },
  address: {
    type: String,
    required: [true, 'Address is required!'],
    trim: true,
    default: null,
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required!'],
    trim: true,
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
      enrollmentApplications: this.enrollmentApplications,
      orders: this.orders,
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
      fatherName:this.fatherName,
      weight:this.weight,
      isMarried:this.isMarried,
      education:this.education,
      job:this.job,
      immediateFamily:this.immediateFamily,
      carerFname:this.carerFname,
      carerLname:this.carerLname,
      carerAge:this.carerAge,
      carerRel:this.carerRel,
      carerEducation: this.carerEducation,
      carerGender: this.carerGender,
      gender:this.gender,
      idCode:this.idCode,
      isSmoker:this.isSmoker,
      isAlcoholic:this.isAlcoholic,
      allergy:this.allergy,
      hasDiabetes:this.hasDiabetes,
      hasHTN:this.hasHTN,
      hasEyeKer:this.hasEyeKer,
      eyemh:this.eyemh,
      drugHistory:this.drugHistory,
      tel:this.tel,
      birth:this.birth,
      address:this.address,
      age: this.age,
      email: this.email,
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
