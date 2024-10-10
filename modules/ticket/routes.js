const { Router } = require('express');
const ticketControllers = require('./controllers');
const { jwtUserAuth } = require('../../middlewares/passport');

const router = new Router();

router.post('/', jwtUserAuth, ticketControllers.createTicket);
router.delete('/:id', jwtUserAuth, ticketControllers.deleteTicket)
router.get('/:id', ticketControllers.getTicketById)
router.get('/', ticketControllers.getTickets)

module.exports = router;
