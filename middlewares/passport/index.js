const passport = require('passport');
const local = require('./strategy/localAuth');
const jwtStrategy = require('./strategy/jwtAuth');

passport.use('adminLocal', local.adminStrategy);
passport.use('userLocal', local.userStrategy);
passport.use('doctorLocal', local.doctorStrategy);
passport.use('adminJWT', jwtStrategy.adminStrategy);
passport.use('doctorJWT', jwtStrategy.doctorStrategy);
passport.use('userJWT', jwtStrategy.userStrategy);

module.exports = {
  init: (app) => app.use(passport.initialize()),
  localAdminAuth: passport.authenticate('adminLocal', { session: false }),
  localUserAuth: passport.authenticate('userLocal', { session: false }),
  localDoctorAuth: passport.authenticate('doctorLocal', { session: false }),
  jwtDoctorAuth: passport.authenticate('doctorJWT', { session: false }),
  jwtAdminAuth: passport.authenticate('adminJWT', { session: false }),
  jwtUserAuth: passport.authenticate('userJWT', { session: false }),
};
