const adminSchema = require('./model');
const httpStatus = require('http-status');

const login = async (req, res, next) => {
  const expiresIn = req.body.rememberMe ? 7 * 24 * 3600 : 8 * 3600;
  const token = req.user.createToken(expiresIn);
  res.status(httpStatus.OK).json({ ...req.user.toAuthJSON(token), expiresIn });
  return next();
};

const signUp = async (req, res) => {
  try {
    const user = await adminSchema.create(req.body);
    res.status(httpStatus.CREATED).json(user);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json(error);
  }
};

module.exports = {
  login,
  signUp,
};
