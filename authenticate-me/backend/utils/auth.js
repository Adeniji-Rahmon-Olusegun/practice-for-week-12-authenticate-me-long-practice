const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User } = require('../db/models');
const { EagerLoadingError } = require('sequelize');

const { secret, expiresIn } = jwtConfig;

const setTokenCookie = (res, user) => {
    const token = jwt.sign(
        { data: user.toSafeObject() },
        secret,
        { expiresIn: parseInt(expiresIn) }
    );

    const isProduction = process.env.NODE_ENV = "production";

    res.cookie('token', token, {
        maxAge: expiresIn * 1000,
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction && "Lax"
    });

    return token;
}

const restoreUser = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) return next();

    try {
        const payload = jwt.verify(token, secret);
        const { id } = payload.data;
        const user = await User.getCurrentUserById(id);

        if (user) {
            req.user = user;
        } else {
            res.clearCookie('token')
        }
    } catch (error) {
        res.clearCookie('token')
    }

    return next();
}

const requireAuth = [
    restoreUser,
    function (req, _res, next) {
        if (req.user) return next();

        const err = new Error('Unauthorized');
        err.title = 'Unauthorized';
        err.errors = ['Unauthorized'];
        err.status = 404;

        return next(err);
    }
];

module.exports = {
    setTokenCookie,
    restoreUser,
    requireAuth
};