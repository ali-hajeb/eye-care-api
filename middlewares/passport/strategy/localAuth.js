const LocalStrategy = require('passport-local');
const userSchema = require('../../../modules/user/model');
const doctorSchema = require('../../../modules/doctor/model');
const adminSchema = require('../../../modules/admin/model');

const options = {
  // usernameField: 'email',
  usernameField: 'idCode',
};

const userStrategy = new LocalStrategy(
  options,
  // async (email, password, done) => {
  async (idCode, password, done) => {
    try {
      // const user = await userSchema.findOne({ email: email.toLowerCase() });
      const user = await userSchema.findOne({ idCode });
      if (!user) return done(null, false);
      else if (!user.authenticateUser(password)) return done(null, false);
      return done(null, user);
    } catch (error) {
      console.log(error);
      return done(error, false);
    }
  },
);

const doctorStrategy = new LocalStrategy(
  options,
  // async (email, password, done) => {
  async (idCode, password, done) => {
    try {
      // const doctor = await doctorSchema.findOne({ email: email.toLowerCase() });
      const doctor = await doctorSchema.findOne({ idCode });
      if (!doctor) return done(null, false);
      else if (!doctor.authenticateDoctor(password)) return done(null, false);
      return done(null, doctor);
    } catch (error) {
      console.log(error);
      return done(error, false);
    }
  },
);

const adminStrategy = new LocalStrategy(
  options,
  async (usernameOrEmail, password, done) => {
    try {
      const admin = await adminSchema.findOne({
        $or: [
          { username: usernameOrEmail },
          { email: usernameOrEmail.toLowerCase() },
        ],
      });
      if (!admin) return done(null, false);
      else if (!admin.authenticateUser(password)) return done(null, false);
      return done(null, admin);
    } catch (error) {
      console.log(error);
      return done(error, false);
    }
  },
);

module.exports = { userStrategy, doctorStrategy, adminStrategy };
