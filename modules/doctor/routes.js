const { Router } = require('express');
const doctorControllers = require('./controllers');
const { localDoctorAuth, jwtDoctorAuth, jwtUserAuth, jwtAdminAuth } = require('../../middlewares/passport');

const router = new Router();

router.post('/login', localDoctorAuth, doctorControllers.login);
router.post('/signup', doctorControllers.signUp);

router.patch('/', jwtDoctorAuth, doctorControllers.updateDoc);

router.get('/me', jwtDoctorAuth, doctorControllers.getData);
router.get('/:id', jwtUserAuth, doctorControllers.getDocData);
router.get('/all', jwtUserAuth, doctorControllers.getDoctors);

module.exports = router;
