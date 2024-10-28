const httpStatus = require("http-status")
const userSchema = require('../user/model');
const doctorSchema = require('../doctor/model');
const nobatSchema = require('./model');


const getDay = async (req, res) => {
  try {
    const { date } = req.query;
    const allDoctors = await doctorSchema.find();
    const schedule = [];
    const d = new Date(date);
    const day = { date: d.toISOString(), docs: [] }
    if (allDoctors) {
      // for (let i = 0; i < 31; i++) {
      // d.setDate(d.getDate() + i);
      // d.setHours(0);
      // d.setMinutes(0);
      // d.setSeconds(0);

      console.log(day.date)
      const allNobats = await nobatSchema.find({})
      const todayNobats = allNobats.filter(n => n.date === d.toISOString());

      for (const doc of allDoctors) {
        let nobats = 0;
        const _doc = {
          id: doc._id,
          name: `${doc.firstName} ${doc.lastName}`,
          field: doc.field,
          major: doc.major
        }


        if (todayNobats) nobats = todayNobats.filter(n => n.doctor.equals(doc._id));
        console.log('[getDay]', todayNobats, nobats)
        if (nobats.length >= doc.maxPatients) {
          day.docs.push({ ..._doc, full: true })
        } else {
          const weekDay = d.getDay();
          if (doc.workDays.includes(weekDay)) {
            day.docs.push({ ..._doc, full: false })
          }
        }
      }
      schedule.push(day);
    }
    // }
    return res.status(httpStatus.OK).json(day);
  } catch (error) {
    console.log('[GetDay] er: ', error);
    return res.status(httpStatus.BAD_REQUEST).json(error);
  }
}

const getAllUserNobat = async (req, res) => {
  try {
    const { filter = {}, limit = 0, skip = 0, populate = [] } = req.query;

    console.log(req.query, req.user._id.toString())
    const list = await nobatSchema
      .find({ ...filter, patient: req.user._id }, null, {
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

const createNobat = async (req, res) => {
  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const user = await req.user.populate('nobat')
    console.log('[today]: ', today, user.nobat)
    if (user.nobat.findIndex(n => n.date === today.toISOString()) > -1) {
      return res.status(400).json({message: 'EXISTS'});
    }
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
    const nobat = await nobatSchema.findByIdAndDelete(id);
    await userSchema.findByIdAndUpdate(req.user.id, { $pull: { nobat: nobat._id } });
    return res.status(httpStatus.OK).send();
  } catch (error) {
    console.error('[Nobat:del] er: ', error);
    res.status(httpStatus.BAD_REQUEST).json(error)
  }
}

const getAllForDoc = async (req, res) => {
  try {
    const { filter = {}, limit = 0, skip = 0, populate = [] } = req.query;
    const list = await nobatSchema
      .find(filter, null, {
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
  getAllForDoc,
  getAllUserNobat,
  getDay
}