const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../../../config/passport')(passport);


//controller
const userController = require('../../../controllers/user_controller');
//authcheck
const authcheck = require('../../../config/authcheck');

//register route
//router.get('/register',  authcheck.logggedInAlready, userController.register);
//register process
//router.post('/register',  authcheck.logggedInAlready, userController.registerprocess);
//login route
router.get('/login', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/login/callback', passport.authenticate('google', { failureRedirect: '/' }),(req, res) => {
    res.redirect('/');
  });
//logout route
router.get('/logout',  userController.logout);

//export router
module.exports = router;
