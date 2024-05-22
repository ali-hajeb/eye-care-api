const { Strategy, ExtractJwt } = require('passport-jwt');
const userSchema = require('../../../modules/user/model');
const adminSchema = require('../../../modules/admin/model');
const { JWT_SECRET } = process.env;

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
  secretOrKey: JWT_SECRET,
};

const userStrategy = new Strategy(options, async (payload, done) => {
  try {
    const user = await userSchema.findById(payload._id);
    if (!user) return done(null, false);
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
});

const adminStrategy = new Strategy(options, async (payload, done) => {
  try {
    const admin = await adminSchema.findById(payload._id);
    if (!admin) return done(null, false);
    return done(null, admin);
  } catch (error) {
    return done(error, false);
  }
});

module.exports = {
  userStrategy,
  adminStrategy,
};
