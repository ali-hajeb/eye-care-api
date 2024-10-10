const httpStatus = require('http-status');
const ticketSchema = require('./model');
const questionSchema = require('../question/model');

const createTicket = async (req, res) => {
  try {
    const ticket = await ticketSchema.create({ ...req.body, patient: req.user._id });
    res.status(httpStatus.OK).json(ticket);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json(error);
  }
}

const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await ticketSchema.findByIdAndDelete(id);
    for (const msg in ticket.messages) {
      await questionSchema.findByIdAndDelete(id);
    }
    res.status(httpStatus.OK).json(ticket);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json(error);
  }
}

const getTickets = async (req, res) => {
  try {
    const {
      filter = {},
      limit = 0,
      skip = 0,
      sort = JSON.stringify({ createdAt: -1 }),
      populate = [],
    } = req.query;

    const ticket = await ticketSchema.find(filter, null, {
      limit,
      skip,
      sort: JSON.parse(sort),
    }).populate(populate);

    res.status(httpStatus.OK).json(ticket);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json(error);
  }
}

const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    const { populate = []} = req.query;
    const ticket = await ticketSchema.findById(id).populate(populate);
    res.status(httpStatus.OK).json(ticket);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json(error);
  }
}

module.exports = {
  createTicket,
  deleteTicket,
  getTickets,
  getTicketById
}