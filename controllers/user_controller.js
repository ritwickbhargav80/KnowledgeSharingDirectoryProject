// const bcrypt = require("bcryptjs");
// const passport = require("passport");
// const mongoose = require("mongoose");

// require("dotenv").config();

//load user model
const User = require("../models/User");
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

const createToken = require("../config/jwt");

module.exports.generateAndSendToken = (req, res) => {
  const { googleId, imageUrl, email, name } = req.body;
  const newUser = {
    googleID: googleId,
    name: name,
    email: email,
    img: imageUrl
  };
  User.findOne({ googleID: googleId }).then(user => {
    if (user) {
      token = createToken(user);
      res.json({ token });
    } else {
      new User(newUser).save().then(user => {
        token = createToken(user);
        console.log("User Created and saved in database!");
        res.json({ token });
      });
    }
  });
};

module.exports.receiveAndVerifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    // Split at the space
    const bearerToken = bearerHeader.split(" ")[1];
    // Set the token
    req.token = bearerToken;
    //verify the token
    jwt.verify(req.token, process.env.SECRET_KEY, (err, authData) => {
      if (err) {
        res.json({ message: "Forbidden" });
      } else {
        req.auth = authData;
      }
    });
    // Next middleware
    next();
  } else {
    res.json({ message: "Forbidden" });
  }
};

/*
module.exports.register = (req, res) =>{
	res.json('users/register');
}


module.exports.registerprocess = (req, res) => {
  const { name, email, field, password, password2 } = req.body;
  let errors = [];
  if (!email || !password || !password2) {
    errors.push("Please enter all fields");
  }
  if (password != password2) {
    errors.push("Passwords do not match");
  }
  if (password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }
  if (errors.length > 0) {
    res.json("users/register", { error: errors });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push("Email already exists");
        res.json("users/register", { error: errors });
      } else {
        const newUser = new Admin({
          email,
          role: field,
          password: password
        });
        console.log(newUser);
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("back");
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
};

module.exports.login = (req,res)=>{
	res.json('users/login');
}

module.exports.loginprocess = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/resources',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
}
*/
// module.exports.logout = (req, res) => {
//   req.logout();
//   res.json({ message: "You are logged out" });
//   res.redirect('/');
// };
