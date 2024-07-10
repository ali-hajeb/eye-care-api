const httpStatus = require("http-status")
const userSchema = require('../user/model');
const nobatSchema = require('./model');


const createNobat = async (req, res) => {
  try {
    const nobat = await nobatSchema.create({ ...req.body });
    await userSchema.findByIdAndUpdate(req.user.id, { $addToSet: { nobat: nobat._id } });
    return res.status(httpStatus.OK).json(nobat);
  } catch (error) {
    console.error('[Nobat:Cre] er: ', error);
    res.status(httpStatus.BAD_REQUEST).json(error)
  }
}

const updateNobat = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedNobat = await nobatSchema.findByIdAndUpdate(id, { ...req.body }, { new: true });
    await userSchema.findByIdAndUpdate(req.user.id, { $pull: { nobat: id } });
    return res.status(httpStatus.OK).json(updatedNobat)
  } catch (error) {
    console.error('[Nobat:upd] er: ', error);
    res.status(httpStatus.BAD_REQUEST).json(error)
  }
}

const deleteNobat = async (req, res) => {
  try {
    const { id } = req.params;
    const nobat = await nobatSchema.findOneAndDelete({ id }, {});
    await userSchema.findByIdAndUpdate(req.user.id, { $pull: { nobat: nobat._id } });
    return res.status(httpStatus.OK).send();
  } catch (error) {
    console.error('[Nobat:del] er: ', error);
    res.status(httpStatus.BAD_REQUEST).json(error)
  }
}

const getAllForDoc = async (req, res) => {
  try {
    const { filter = '{}', limit = 0, skip = 0, populate = [] } = req.query;
    const list = await nobatSchema
      .find(JSON.parse(filter), null, {
        limit,
        skip,
        sort: { createdAt: -1 },
      })
      .populate(populate);
    res.status(httpStatus.OK).json(list);
  } catch (error) {
    console.error('[Nobat:gta] er: ', error);
    res.status(httpStatus.BAD_REQUEST).json(error)
  }
}

module.exports = {
  createNobat,
  updateNobat,
  deleteNobat,
  getAllForDoc
}