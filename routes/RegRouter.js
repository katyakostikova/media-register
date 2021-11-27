const router = require('express').Router();
const authController = require('../controllers/AuthController');

router.get('/', authController.getRegData);
router.post('/', authController.addAdmin);
router.post('/registrator', authController.addRegistrator);

module.exports = router;