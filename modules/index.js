const userRoutes = require('./user/routes');
const adminRoutes = require('./admin/routes');
const doctorRoutes = require('./doctor/routes');
const nobatRoutes = require('./nobat/routes');
const medRoutes = require('./med/routes');
const tipRoutes = require('./tip/routes');
const ticketRoutes = require('./ticket/routes');
const questionRoutes = require('./question/routes');

module.exports = (app) => {
  app.use('/api/v1/admin', adminRoutes);
  app.use('/api/v1/user', userRoutes);
  app.use('/api/v1/doctor', doctorRoutes);
  app.use('/api/v1/nobat', nobatRoutes);
  app.use('/api/v1/med', medRoutes);
  app.use('/api/v1/tip', tipRoutes);
  app.use('/api/v1/ticket', ticketRoutes);
  app.use('/api/v1/question', questionRoutes);
};
