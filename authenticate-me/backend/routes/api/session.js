const router = require('express').Router();

const { User } = require('../../db/models');
const { setTokenCookie, restoreUser } = require('../../utils/auth');

router.post('/', async (req, res, next) => {
    const { credential, password } = req.body;

    const user = await User.login({ credential, password });

    if (user) {
        setTokenCookie(res, user);
        return res.json(user);
    } else {
        const err = new Error("Login failed");
        err.status = 401;
        err.title = "Login failed";
        err.errors = ['The provided credentials were invalid.'];
        return next(err);
    }
});

router.delete('/',(_req, res) => {
    res.clearCookie('token');
    res.json({ message: "success"})
});

router.get('/', restoreUser, (req, res) => {
    const user = req.user;

    if (user) {
        res.json({
            user: user.toSafeObject()
        });
    } else {
        res.json({});
    }
})



module.exports = router;