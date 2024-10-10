const { Router } = require('express');
const questionControllers = require('./controllers');
const { jwtUserAuth, jwtDoctorAuth } = require('../../middlewares/passport');

const router = new Router();

router.post('/', jwtUserAuth, questionControllers.newQuestion);
router.post('/doc', jwtDoctorAuth, questionControllers.newQuestion);
router.delete('/doc/:id', jwtDoctorAuth, questionControllers.deleteQuestion)
router.delete('/:id', jwtUserAuth, questionControllers.deleteQuestion)
router.patch('/:id', jwtUserAuth, questionControllers.editQuestion)
router.get('/:id', jwtUserAuth, questionControllers.getQuestionById)
router.get('/', jwtUserAuth, questionControllers.getQuestions)

module.exports = router;
