const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { ValidationError } = require('sequelize');
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

app.use((_req, _res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.title = 'Resource not found';
    err.errors = ['The requested resource couldn\'t be found'];
    err.status = 404;
    next(err);
});

app.use((err, _req, _res, next) => {
    if (err instanceof ValidationError) {
        err.errors = err.errors.map((e) => e.message);
        err.title = "Validation Error";
    }

    next(err);
});

app.use((err, _req, res, _next) => {
    res.status(err.status || 500);
    console.error(err);
    res.json({
        title: err.title,
        message: err.message,
        errors: err.errors,
        stack: isProduction ? null : err.stack
    });
});

module.exports = app;

