const { Router } = require('express');
const tipControllers = require('./controllers');
const { jwtDoctorAuth } = require('../../middlewares/passport');

const router = new Router();

router.post('/', tipControllers.addTip);
router.delete('/:id', jwtDoctorAuth, tipControllers.deleteTip)
router.patch('/:id', jwtDoctorAuth, tipControllers.updateTip)
router.get('/doc', jwtDoctorAuth, tipControllers.getTipsDoc)
router.get('/:id', tipControllers.getTipById)
router.get('/', tipControllers.getTips)

module.exports = router;
