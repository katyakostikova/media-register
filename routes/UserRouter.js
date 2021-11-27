const router = require('express').Router();
const userController = require('../controllers/UserController');

//router.get('/', userController.getPersons);
router.get('/registrators', userController.getRegistrators);
router.get('/registrators/:id', userController.viewRegistrator);
router.get('/activate/:id', userController.activateRegistrator);
router.get('/deactivate/:id', userController.deactivateRegistrator);
router.get('/:id', userController.getUserById);


module.exports = router;