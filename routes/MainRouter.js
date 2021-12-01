const router = require('express').Router();
 const userRouter = require('./UserRouter');
const massMediaRouter = require('./MassMediaRouter');
const authRouter = require('./AuthRouter');

 router.use('/users', userRouter);

router.use('/auth', authRouter);
router.use('/mass_medias', massMediaRouter);
router.use('/', massMediaRouter);

module.exports = router;