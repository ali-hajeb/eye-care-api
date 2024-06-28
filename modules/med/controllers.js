const medSchema = require('./model');
const userSchema = require('../user/model');
const httpStatus = require('http-status');
const { Types } = require('mongoose');

const { ObjectId } = Types

const addMed = async (req, res) => {
  try {
    const newMed = await medSchema.create({ ...req.body });
    await userSchema.findByIdAndUpdate(req.user.id, { $addToSet: { meds: newMed._id } });
    return res.status(httpStatus.OK).json(newMed);
  } catch (error) {
    console.log('[AddMed] er: ', error);
    if (newMed) await medSchema.findByIdAndDelete(newMed._id)
    return res.status(httpStatus.BAD_REQUEST).json(error);
  }
}

const deleteMed = async (req, res) => {
  try {
    const { id } = req.params
    await medSchema.findByIdAndDelete(id);
    await userSchema.findByIdAndUpdate(req.user.id, { $pull: { meds: id } });
    return res.status(httpStatus.OK).send();
  } catch (error) {
    console.log('[DelMed] er: ', error);
    return res.status(httpStatus.BAD_REQUEST).json(error);
  }
}

const deleteMedOnSync = async (req, res) => {
  try {
    const { id } = req.params;
    await medSchema.findOneAndDelete({id});
    return res.status(httpStatus.OK).send();
  } catch (error) {
    console.log('[SyncDelMed] er: ', error);
    return res.status(httpStatus.BAD_REQUEST).json(error);
  }
}

const updateMed = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMed = await medSchema.findByIdAndUpdate(id , { ...req.body }, { new: true });
    return res.status(httpStatus.OK).json(updatedMed)
  } catch (error) {
    console.log('[UpdatedMed] er: ', error);
    return res.status(httpStatus.BAD_REQUEST).json(error);
  }
}

const updateMedOnSync = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMed = await medSchema.findOneAndUpdate({id} , { ...req.body }, { new: true });
    return res.status(httpStatus.OK).json(updatedMed)
  } catch (error) {
    console.log('[UpdatedMed] er: ', error);
    return res.status(httpStatus.BAD_REQUEST).json(error);
  }
}

module.exports = {
  addMed,
  deleteMed,
  deleteMedOnSync,
  updateMed,
  updateMedOnSync
}