const router = require('express').Router();
const userController = require('../controllers/UserController');

//router.get('/', userController.getPersons);
router.get('/:id', userController.getUserById);

module.exports = router;