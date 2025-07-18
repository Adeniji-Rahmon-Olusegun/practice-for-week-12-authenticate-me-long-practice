const router = require('express').Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { validateSignup } = require('../../utils/validation');

router.post('/', validateSignup, async (req, res, next) => {
    const { username, email, password } = req.body;

    const newUser = await User.signup({ username, email, password });

    if (newUser) {
        setTokenCookie(res, newUser);
        return res.json(newUser);
    }
})

module.exports = router;

