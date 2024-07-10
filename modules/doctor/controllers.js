const doctorSchema = require('./model');

const login = async (req, res, next) => {
  const expiresIn = req.body.rememberMe ? 300 * 24 * 3600 : 3600;
  const token = req.user.createToken(expiresIn);

  res.status(httpStatus.OK).json({ ...req.user.toAuthJSON(token), expiresIn });
  return next();
};

const signUp = async (req, res) => {
  try {
    const doctor = await doctorSchema.create(req.body);
    const expiresIn = 3600;
    const token = doctor.createToken(expiresIn);
    return res
      .status(httpStatus.CREATED)
      .json({ ...doctor, token: `JWT ${token}`, expiresIn });
  } catch (error) {
    console.log(error);
    let errorMessage = {};
    if (error.code === 11000) {
      errorMessage = {
        code: 'EXIST',
        fields: Object.keys(error.keyPattern),
      }
    } else if (error.name === 'ValidationError') {
      errorMessage = {
        code: 'INVALID',
        fields: Object.keys(error.errors)
      }
    } else errorMessage = error;
    return res.status(httpStatus.BAD_REQUEST).json(errorMessage);
  }
};

const updateDoc = async (req, res) => {
  try {
    const doctor = await doctorSchema.findByIdAndUpdate(req.user._id, req.body, { new: true });
    res.status(httpStatus.OK).json(doctor);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json(error);
  }
}

const getData = async (req, res, next) => {
  res
    .status(httpStatus.OK)
    .json(await req.user.populate('Users'));
  return next();
};

const getDocData = async (req, res, next) => {
  try {
    const { id } = req.params
    const doc = await doctorSchema.findById(id);
    res
      .status(httpStatus.OK)
      .json(doc.toPublicJSON());
  } catch (error) {
    console.log('[getDocData] er: ', error);
    return res.status(httpStatus.BAD_REQUEST).json(error);
  }
};

const getDoctors = async (req, res, next) => {
  try {
    const docs = await doctorSchema.find({});
    const docsList = docs.map(d => d.toPublicJSON())
    res
      .status(httpStatus.OK)
      .json(docsList);
  } catch (error) {
    console.log('[getDocData] er: ', error);
    return res.status(httpStatus.BAD_REQUEST).json(error);
  }
};

const deleteDoc = async (req, res) => {
  try {
    const { id } = req.params
    await doctorSchema.findByIdAndDelete(id);
    return res.status(httpStatus.OK).send();
  } catch (error) {
    console.log('[DelDoc] er: ', error);
    return res.status(httpStatus.BAD_REQUEST).json(error);
  }
}

module.exports = {
  signUp, login, deleteDoc, updateDoc, getData, getDocData, getDoctors
}