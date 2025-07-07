const router = require('express').Router();
const sessionRouter = require('./session.js');
const userRouter = require('./users.js')

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth.js');
const { User } = require('../../db/models');

router.use('/session', sessionRouter);
router.use('/users', userRouter);

router.post('/test', (req, res) => {
    res.json({ requestBody: req.body })
});

router.get('/set-token-cookie', async (req, res) => {
    const user = await User.findOne({
        where: { username: 'Demo-lition' }
    });

    setTokenCookie(res, user);
    res.json({ user });
});

router.get('/restore-user', restoreUser, (req, res) => {
    return res.json(req.user)
});

router.get('/require-auth', requireAuth, (req, res) => {
    res.json(req.user)
})

module.exports = router;