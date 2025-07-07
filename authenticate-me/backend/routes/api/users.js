const router = require('express').Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

router.post('/', async (req, res, next) => {
    const { username, email, password } = req.body;

    const newUser = await User.signup({ username, email, password });

    if (newUser) {
        setTokenCookie(res, newUser);
        return res.json(newUser);
    }
})

module.exports = router;

