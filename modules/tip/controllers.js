const tipSchema = require('./model');
const httpStatus = require('http-status');
const { Types } = require('mongoose');

const { ObjectId } = Types

const addTip = async (req, res) => {
  try {
    const newTip = await tipSchema.create({ ...req.body, author: req.user._id });
    return res.status(httpStatus.OK).json(newTip);
  } catch (error) {
    console.log('[AddTip] er: ', error);
    return res.status(httpStatus.BAD_REQUEST).json(error);
  }
}

const deleteTip = async (req, res) => {
  try {
    const { id } = req.params
    await tipSchema.findByIdAndDelete(id);
    return res.status(httpStatus.OK).send();
  } catch (error) {
    console.log('[DelTip] er: ', error);
    return res.status(httpStatus.BAD_REQUEST).json(error);
  }
}

const updateTip = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTip = await tipSchema.findByIdAndUpdate(id, { ...req.body }, { new: true });
    return res.status(httpStatus.OK).json(updatedTip)
  } catch (error) {
    console.log('[UpdatedTip] er: ', error);
    return res.status(httpStatus.BAD_REQUEST).json(error);
  }
}

const getTipById = async (req, res) => {
  try {
    const { id } = req.params;
    const tip = await tipSchema.findById(id)

    if (!tip) res.status(httpStatus.NOT_FOUND).send()

    res.status(httpStatus.OK).json(tip);
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json(error);
  }
}

const getTips = async (req, res) => {
  try {
    const {
      filter = {},
      limit = 0,
      skip = 0,
      sort = JSON.stringify({ createdAt: -1 }),
      populate = [],
    } = req.query;

    const tips = await tipSchema.find(filter, null, {
      limit,
      skip,
      sort: JSON.parse(sort),
    }).populate(populate);

    res.status(httpStatus.OK).json(tips);
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json(error);
  }
}

const getTipsDoc = async (req, res) => {
  try {
    const {
      filter = {},
      limit = 0,
      skip = 0,
      sort = JSON.stringify({ createdAt: -1 }),
      populate = [],
    } = req.query;

    console.log(req.user, req.user._id, req.user.role)

    const finalFilter = (req.user.role !== 'admin') ? { ...filter, author: req.user._id } : { ...filter }

    const tips = await tipSchema.find(finalFilter, null, {
      limit,
      skip,
      sort: JSON.parse(sort),
    }).populate(populate);

    res.status(httpStatus.OK).json(tips);
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json(error);
  }
}

module.exports = {
  addTip,
  deleteTip,
  updateTip,
  getTips,
  getTipsDoc,
  getTipById
}