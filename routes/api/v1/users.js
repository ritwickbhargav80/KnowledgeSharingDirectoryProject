const express = require('express');
const router = express.Router();

//controller
const userController = require('../../../controllers/user_controller');
//authcheck
const authcheck = require('../../../config/authcheck');

//register route
router.get('/register',  authcheck.logggedInAlready, userController.register);
//register process
router.post('/register',  authcheck.logggedInAlready, userController.registerprocess);
//login route
router.get('/login', authcheck.logggedInAlready, userController.login);
//login process
router.post('/login', authcheck.logggedInAlready, userController.loginprocess);
//logout route
router.get('/logout',  userController.logout);

//export router
module.exports = router;
