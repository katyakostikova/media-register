const router = require('express').Router();
const authController = require('../controllers/AuthController');

router.get('/', authController.getRegData);
router.get('/user', authController.getRegDataUser);
router.post('/user', authController.addUser);
router.post('/', authController.addAdmin);
router.post('/registrator', authController.addRegistrator);

module.exports = router;