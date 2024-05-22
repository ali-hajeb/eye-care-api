require('dotenv').config();
require('./config/database').connect();

const path = require('path');
const express = require('express');
const cors = require('cors');

// eslint-disable-next-line no-undef
const domainsFromEnv = process.env.CORS_DOMAINS || '';
const whitListDomains = domainsFromEnv
    .split(',')
    .map((domain) => domain.trim());
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitListDomains.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};

const middleware = require('./middlewares');
const apiRoutes = require('./modules');

const app = express();


app.use(cors(corsOptions));
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/receipts', express.static('../api.cogno.team/upload/receipts'));
// app.use('/public', cors(), express.static('../api.cogno.team/upload/public'));

middleware(app);
apiRoutes(app);

module.exports = app;




// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

// var app = express();

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// module.exports = app;
