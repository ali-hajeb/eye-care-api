const { Router } = require('express');
const userControllers = require('./controllers');
const { localUserAuth, jwtUserAuth, jwtAdminAuth, jwtDoctorAuth } = require('../../middlewares/passport');

const router = new Router();

router.post('/login', localUserAuth, userControllers.login);
router.post('/confirm', userControllers.confirmEmail);
router.post('/password/verification', userControllers.changePasswordEmailVerification);
router.post('/password', userControllers.changePassword);

router.post('/signup', userControllers.signUp);
router.post('/update', jwtUserAuth, userControllers.updateUser);
router.get('/', jwtUserAuth, userControllers.getUserData);
router.get('/all', jwtAdminAuth, userControllers.getUsers);
router.get('/doctor/all', jwtDoctorAuth, userControllers.getUsers);

module.exports = router;
