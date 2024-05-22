const isDev = process.env.NODE_ENV === 'development';
const emailConfrimationUrl = `https://${process.env.CLIENT_DOMAIN}/verify?token=`;
const passwordChangeEmailUrl = `https://${process.env.CLIENT_DOMAIN}/change_password?token=`;
const defaultCourseThumbnail = 'https://api.cogno.team/public/thumbnails/no-image.jpg';
const defaultUserThumbnail = 'https://cogno.team/profile.svg';
const isProd = process.env.NODE_ENV === 'production';
const nextpayAPIkey = process.env.NEXTPAY_API_KEY;
const passwordReg = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
const mobilePhoneRegex = /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/;
const iranianMobilePhoneRegex = /^(\+98|0)?9\d{9}$/g;
const engLetterOnlyReg = /^[a-zA-Z\s]*$/;
const uploadRootDirectory = '../api.cogno.team/upload';
const uploadDirectories = {
    thumbnailsDirectory: '/public/thumbnails/',
    coursesDirectory: '/public/course/',
    professorsDirectory: '/public/professors/',
    receiptDirectory: '/receipts/',
    postDirectory: '/public/post/',
};

module.exports = {
    isDev,
    emailConfrimationUrl,
    passwordChangeEmailUrl,
    isProd,
    nextpayAPIkey,
    passwordReg,
    mobilePhoneRegex,
    iranianMobilePhoneRegex,
    engLetterOnlyReg,
    uploadRootDirectory,
    uploadDirectories,
    defaultCourseThumbnail,
    defaultUserThumbnail
};
