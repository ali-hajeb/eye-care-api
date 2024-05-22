const morgan = require('morgan');
const compression = require('compression');
const express = require('express');
const passport = require('./passport');
const helmet = require('helmet');

const {
    isDev,
    isProd,
} = require('../utils');

module.exports = (app) => {
    if (isProd) {
        app.use(compression());
        app.use(helmet());
    }

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    passport.init(app);

    if (isDev) app.use(morgan('dev'));

    // for (const dir in uploadDirectories) {
    //     if (!fs.existsSync(uploadRootDirectory + uploadDirectories[dir])) {
    //         fs.mkdirSync(uploadRootDirectory + uploadDirectories[dir], {
    //             recursive: true,
    //         });
    //         console.log('> Created ', uploadRootDirectory + uploadDirectories[dir]);
    //     }
    // }
};
