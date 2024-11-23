const httpStatus = require('http-status');
const doctorSchema = require('./model');
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
    const doctor = req.user
    console.log(doctor)
    await sendVerificationLink(doctor);
    return res.status(httpStatus.OK).send();
  } catch (err) {
    console.log(err)
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }
}

const sendVerificationLink = async (doctor) => {
  const verificationToken = doctor.generateVerificationToken();

  const url = `${emailConfrimationUrl}${verificationToken}&isDoc=1`;

  await transporter.sendMail({
    from: '"CT Care" <no-reply@eye-care.ir',
    to: doctor.email,
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
            <p>دکتر ${doctor.lastName} عزیز، درود!</p>
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
  try {
    const doctor = await doctorSchema.create(req.body);
    const expiresIn = 3600;
    const token = doctor.createToken(expiresIn);
    res
      .status(httpStatus.CREATED)
      .json({ ...doctor, token: `JWT ${token}`, expiresIn });
    await sendVerificationLink(doctor);
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
    .json(await req.user.toJSON());
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
    console.log(payload)
  } catch (err) {
    console.log(err)
    return res.status(500).json(err);
  }
  try {
    const doctor = await doctorSchema.findOne({ _id: payload._id }).exec();
    if (!doctor) {
      return res.status(404).send({
        code: 'NONEXIST',
        message: 'User does not  exists',
      });
    }
    doctor.isActive = true;
    await doctor.save();
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
    const doctor = await doctorSchema.findOne({ _id: payload._id }).exec();
    if (!doctor) {
      return res.status(404).send({
        code: 'NONEXIST',
        message: 'User does not exist',
      });
    }
    doctor.password = newPassword;
    await doctor.save();
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
    const doctor = await doctorSchema.findOne({ email: req.body.email });
    if (!doctor) return res.status(httpStatus.OK).send();
    const verificationToken = doctor.generateVerificationToken();

    const url = `${passwordChangeEmailUrl}${verificationToken}&isDoc=1`;

    await transporter.sendMail({
      from: '"CT Care" <no-reply@eye-care.ir',
      to: doctor.email,
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
            <p>دکتر ${doctor.lastName} عزیز، درود!</p>
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

module.exports = {
  signUp, login, deleteDoc, updateDoc, getData, getDocData, getDoctors, changePassword, changePasswordEmailVerification, confirmEmail, getNewVerificationLink
}