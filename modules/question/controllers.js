const httpStatus = require('http-status');
const questionSchema = require('./model');
const ticketSchema = require('../ticket/model');

const newQuestion = async (req, res) => {
  try {
    const newQuestion = await questionSchema.create(req.body);
    const ticket = await ticketSchema.findByIdAndUpdate(newQuestion.ticketId, { $addToSet: { messages: newQuestion._id } }, { new: true });
    res.status(httpStatus.OK).json({ ticket, newQuestion });
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json(error);
  }
}

const editQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedQuestion = await questionSchema.findByIdAndUpdate(id, { ...req.body }, { new: true });
    res.status(httpStatus.OK).json(updatedQuestion);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json(error);
  }
}

const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await questionSchema.findByIdAndDelete(id);
    const ticket = await ticketSchema.findByIdAndUpdate(question.ticketId, { $pull: { messages: question._id } }, { new: true });
    res.status(httpStatus.OK).json({ ticket, question });
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json(error);
  }
}


const getQuestions = async (req, res) => {
  try {
    const {
      filter = {},
      limit = 0,
      skip = 0,
      sort = JSON.stringify({ createdAt: -1 }),
      populate = [],
    } = req.query;

    const questions = await questionSchema.find(filter, null, {
      limit,
      skip,
      sort: JSON.parse(sort),
    }).populate(populate);

    res.status(httpStatus.OK).json(questions);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json(error);
  }
}

const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await questionSchema.findById(id);
    res.status(httpStatus.OK).json(ticket);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json(error);
  }
}

module.exports = {
  newQuestion,
  editQuestion,
  deleteQuestion,
  getQuestions,
  getQuestionById
}