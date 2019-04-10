const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');

require('dotenv').config();

//load user model
const User = require('../models/User');


module.exports.register = (req, res) =>{
	res.render('users/register');
} 


module.exports.registerprocess = (req, res) => {
  const { name, email,field, password, password2 } = req.body;  
  let errors = [];
  if (!name || !email || !password || !password2) {
    errors.push('Please enter all fields' );
  }
  if (password != password2) {
    errors.push('Passwords do not match');
  }
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  if (errors.length > 0) {
    res.render('users/register', { error: errors });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push('Email already exists');
        res.render('users/register', { error:errors });
      } else {
        const newUser = new User({name: name.toUpperCase(), email, role: field, password });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save().then(user => {
                req.flash('success_msg', 'You are now registered and can log in');
                res.redirect('/users/login');
            }).catch(err => console.log(err));
          });
        });
      }
    });
  }
}

module.exports.login = (req,res)=>{
	res.render('users/login');
}

module.exports.loginprocess = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/resources',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
}

module.exports.logout = (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
};