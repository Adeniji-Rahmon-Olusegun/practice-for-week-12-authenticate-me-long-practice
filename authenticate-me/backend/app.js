const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
require('express-async-errors');

const { environment } = require('./config');
let isProduction = environment === 'production';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

if (!isProduction) app.use(cors());

app.use(
    helmet.crossOriginResourcePolicy({
        policy: 'cross-origin'
    })
);

app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true
        }
    })
);

const routes = require('./routes');

app.use(routes);

module.exports = app;

