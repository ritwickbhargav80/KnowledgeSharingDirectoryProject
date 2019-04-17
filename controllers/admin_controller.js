//import resouces schema
const mongoose = require("mongoose");
const flash = require("connect-flash");
const passport = require("passport");
require("../config/passport")(passport);
require("dotenv").config();

const User = require("../models/User");
const Setting = require("../models/Setting");
const Message = require("../models/Message");

//module.exports.login = (req,res)=>{
//res.render('admin/login');
//}

// module.exports.loginpost = (req, res, next) => {
//   passport.authenticate("local", {
//     successRedirect: "/api/v1/admin/",
//     failureRedirect: "/users/login",
//     failureFlash: true
//   })(req, res, next);
// };

module.exports.index = (req, res) => {
  Message.find().then(message => {
    User.find().then(user => {
      res.json({ messages: message, users: user });
    });
  });
};

module.exports.users = (req, res) => {
  User.find()
    .sort({ role: "asc" })
    .then(result => {
      res.json({ users: result });
    });
};
/*
module.exports.deleteuser = (req,res)=>{
	User.deleteOne({_id: req.params.id}, (err, done)=>{
		if(err) throw err;
		else{
			req.flash('success_msg', 'Deleted successfully!!');
			res.redirect('/admin/users');
		}
	})
}
*/
module.exports.settings = (req, res) => {
  Setting.find().then(result => {
    res.json({ settings: result });
  });
};

module.exports.addsetting = (req, res) => {
  Setting.findOne(
    { for: req.body.for, value: req.body.value },
    (err, entry) => {
      if (err) throw err;
      if (entry) {
        req.json({ message: "Already Entered!" });
        //res.redirect('/admin/settings');
      } else {
        Setting.create(
          { for: req.body.for, field: req.body.field, value: req.body.value },
          (err, done) => {
            if (err) {
              req.json({ message: "Something went wrong." });
              //res.redirect('/admin/settings');
            } else {
              req.json({ message: "Added successfully." });
              //res.redirect('/admin/settings');
            }
          }
        );
      }
    }
  );
};

module.exports.deletesetting = (req, res) => {
  Setting.findOne({ _id: req.params.id }, (err, done) => {
    if (err) throw err;
    else {
      Setting.deleteOne({ _id: req.params.id }, (err, done) => {
        if (err) {
          req.json({ message: "Something went wrong." });
          //res.redirect('/admin/settings');
        } else {
          req.json({ message: "Deleted successfully." });
          //res.redirect('/admin/settings');
        }
      });
    }
  });
};
