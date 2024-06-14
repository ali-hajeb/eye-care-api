const { Router } = require('express');
const medControllers = require('./controllers');
const { jwtUserAuth } = require('../../middlewares/passport');

const router = new Router();

router.post('/', jwtUserAuth, medControllers.addMed);
router.delete('/:id', jwtUserAuth, medControllers.deleteMed)
router.patch('/:id', jwtUserAuth, medControllers.updateMed)

module.exports = router;