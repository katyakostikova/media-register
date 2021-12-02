const router = require('express').Router();
const userController = require('../controllers/UserController');

router.get('/registrators', userController.getRegistrators);
router.get('/users', userController.getUsers);
router.get('/users/:id', userController.viewUser);
router.get('/registrators/:id', userController.viewRegistrator);
router.get('/delete/:id', userController.deleteUser);
router.get('/activate/:id', userController.activateRegistrator);
router.get('/deactivate/:id', userController.deactivateRegistrator);
router.get('/:id', userController.getUserById);


module.exports = router;