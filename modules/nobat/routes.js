const { Router } = require('express');
const nobatControllers = require('./controllers');
const { jwtUserAuth, jwtDoctorAuth } = require('../../middlewares/passport');

const router = new Router();

router.post('/', jwtUserAuth, nobatControllers.createNobat);
router.delete('/:id', jwtUserAuth, nobatControllers.deleteNobat)

router.patch('/:id', jwtUserAuth, nobatControllers.updateNobat)
router.patch('/doc/:id', jwtDoctorAuth, nobatControllers.updateNobat)

router.get('/all', jwtUserAuth, nobatControllers.getAllUserNobat);
router.get('/', jwtUserAuth, nobatControllers.getDay);
router.get('/doc/all', jwtDoctorAuth, nobatControllers.getAllForDoc);


module.exports = router;
