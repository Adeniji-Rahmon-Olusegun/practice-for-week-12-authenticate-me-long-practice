const { check, validationResult } = require('express-validator');
const { ERROR } = require('sqlite3');

const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors = validationErrors.array().map(error => `${error.msg}`);

        const err = new Error('BAD REQUEST.');
        err.errors = errors;
        err.status = 400;
        err.title = 'BAD REQUEST.';
        next(err);
    }

    next();
}

const validationLogin = [
    check('credential')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Please provide a valid email or username.'),
    check('password')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Please provide a password'),
    handleValidationErrors
];

const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters or more.'),
    handleValidationErrors
];

module.exports = {
    handleValidationErrors,
    validationLogin,
    validateSignup
};
