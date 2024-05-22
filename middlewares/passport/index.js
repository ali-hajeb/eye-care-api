const passport = require('passport');
const local = require('./strategy/localAuth');
const jwtStrategy = require('./strategy/jwtAuth');

passport.use('adminLocal', local.adminStrategy);
passport.use('userLocal', local.userStrategy);
passport.use('adminJWT', jwtStrategy.adminStrategy);
passport.use('userJWT', jwtStrategy.userStrategy);

module.exports = {
  init: (app) => app.use(passport.initialize()),
  localAdminAuth: passport.authenticate('adminLocal', { session: false }),
  localUserAuth: passport.authenticate('userLocal', { session: false }),
  jwtAdminAuth: passport.authenticate('adminJWT', { session: false }),
  jwtUserAuth: passport.authenticate('userJWT', { session: false }),
};
