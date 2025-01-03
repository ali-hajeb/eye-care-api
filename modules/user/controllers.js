const userSchema = require('./model');
const httpStatus = require('http-status');
const {
  emailConfrimationUrl,
  passwordChangeEmailUrl,
} = require('../../utils');
const jwt = require('jsonwebtoken');

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'mail.eye-care.ir',
  port: 465,
  secure: true,
  auth: {
    user: 'no-reply@eye-care.ir',
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false }
});

const login = async (req, res, next) => {
  const expiresIn = req.body.rememberMe ? 300 * 24 * 3600 : 3600;
  const token = req.user.createToken(expiresIn);

  res.status(httpStatus.OK).json({ ...req.user.toAuthJSON(token), expiresIn });
  return next();
};

const getNewVerificationLink = async (req, res) => {
  try {
    const user = req.user
    console.log(user)
    await sendVerificationLink(user);
    return res.status(httpStatus.OK).send();
  } catch (err) {
    console.log(err)
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }
}

const sendVerificationLink = async (user) => {
  const verificationToken = user.generateVerificationToken();

  const url = `${emailConfrimationUrl}${verificationToken}`;

  await transporter.sendMail({
    from: '"CT Care" <no-reply@eye-care.ir',
    to: user.email,
    subject: 'فعالسازی حساب کاربری',
    html: `
      <div
    style="
        background-color: #0d8bd9;
        width: 100%;
        direction: rtl;
        overflow-x: hidden;
    ">
    <div
        style="
            background-color: #f9f9f9;
            width: 75%;
            margin: 10% auto;
            padding: 10px 15px;
            border-radius: 16px;
        ">
        <div>
            <h2>فعالسازی ایمیل</h2>
            <p>${user.firstName} عزیز، درود!</p>
            <p>
                برای تکمیل ثبت نام، ایمیل خودتان را از طریق
                <a href="${url}" title="فعالسازی ایمیل">این لینک</a>
                فعال کنید.
            </p>
            <span>${url}</span>
        </div>
    </div>
</div>
      `,
  });
}


const signUp = async (req, res) => {
  console.log('first')
  try {
    await userSchema.init()
    const user = await userSchema.create(req.body);

    const expiresIn = 3600;
    const token = user.createToken(expiresIn);
    return res
      .status(httpStatus.CREATED)
      .json({ ...user, token: `JWT ${token}`, expiresIn });
    await sendVerificationLink(user);
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

const updateUser = async (req, res) => {
  try {
    const user = await userSchema.findByIdAndUpdate(req.user._id, req.body, { new: true });
    res.status(httpStatus.OK).json(user);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json(error);
  }
}

const getUserData = async (req, res, next) => {
  res
    .status(httpStatus.OK)
    .json(await req.user.populate(['meds', 'nobat']));
  return next();
};

const confirmEmail = async (req, res) => {
  const { token } = req.body;
  console.log(token);
  if (!token) {
    return res.status(422).send({
      code: 'NOTOKEN',
      message: 'Missing Token',
    });
  }
  let payload = null;
  try {
    payload = await jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(500).send(err);
  }
  try {
    const user = await userSchema.findOne({ _id: payload._id }).exec();
    if (!user) {
      return res.status(404).send({
        code: 'NONEXIST',
        message: 'User does not  exists',
      });
    }
    user.isActive = true;
    await user.save();
    return res.status(200).send({
      message: 'Account Verified',
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};
const changePassword = async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token) {
    return res.status(422).send({
      code: 'NOTOKEN',
      message: 'Missing Token',
    });
  }
  let payload = null;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(500).send({
      code: 'INVALIDTOKEN',
      message: 'Token is not valid'
    });
  }
  try {
    const user = await userSchema.findOne({ _id: payload._id }).exec();
    if (!user) {
      return res.status(404).send({
        code: 'NONEXIST',
        message: 'User does not  exists',
      });
    }
    user.password = newPassword;
    await user.save();
    return res.status(200).send({
      message: 'password changed',
    });
  } catch (error) {
    let errorMessage = {};
    if (error.name === 'ValidationError') {
      errorMessage = {
        code: 'INVALID',
        fields: Object.keys(error.errors)
      }
    } else errorMessage = error;
    return res.status(500).send(errorMessage);
  }
};
const changePasswordEmailVerification = async (req, res) => {
  try {
    const user = await userSchema.findOne({ email: req.body.email });
    if (!user) return res.status(httpStatus.OK).send();
    const verificationToken = user.generateVerificationToken();

    const url = `${passwordChangeEmailUrl}${verificationToken}`;

    await transporter.sendMail({
      from: '"CT Care" <no-reply@eye-care.ir',
      to: user.email,
      subject: 'تغییر گذرواژه',
      html: `
      <div
    style="
        background-color: #0d8bd9;
        width: 100%;
        direction: rtl;
        overflow-x: hidden;
    ">
    <div
        style="
            background-color: #f9f9f9;
            width: 75%;
            margin: 10% auto;
            padding: 10px 15px;
            border-radius: 16px;
        ">
        <div>
            <h2>تغییر گذرواژه</h2>
            <p>${user.firstName} عزیز، درود!</p>
            <p>
                برای تغییر گذرواژه بر روی
                <a href="${url}" title="تغییر گذرواژه">این لینک</a>
                کلیک کنید.
            </p>
            <span>${url}</span>
        </div>
    </div>
</div>
      `,
    });

    return res.status(200).json({});
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.BAD_REQUEST).json(error);
  }
};

const getUsers = async (req, res) => {
  try {
    const {
      filter = {},
      limit = 0,
      skip = 0,
      sort = JSON.stringify({ createdAt: -1 }),
      populate = [],
    } = req.query;

    const users = await userSchema.find(filter, null, {
      limit,
      skip,
      sort: JSON.parse(sort),
    }).populate(populate);

    res.status(httpStatus.OK).json(users);
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json(error);
  }
}
module.exports = {
  login,
  signUp,
  updateUser,
  confirmEmail,
  changePassword,
  getUserData,
  getUsers,
  changePasswordEmailVerification,
  getNewVerificationLink
};
