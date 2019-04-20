//import resouces schema
require("dotenv").config();

const User = require("../models/User");
const Setting = require("../models/Setting");
const Message = require("../models/Message");

module.exports.messages = (req, res) => {
  Message.find().then(messages => {
    res.json({ messages });
  });
};

module.exports.users = (req, res) => {
  User.find()
    .sort({ role: "asc" })
    .then(result => {
      res.json({ users: result });
    });
};

module.exports.settings = (req, res) => {
  Setting.find({}).then(result => {
    res.json({ settings: result });
  });
};

module.exports.addsetting = (req, res) => {
  Setting.findOne(
    { for: req.body.for, value: req.body.value },
    (err, entry) => {
      if (err) throw err;
      if (entry) {
        res.json({ message: "Already Entered!" });
        //res.redirect('/admin/settings');
      } else {
        Setting.create(
          { for: req.body.for, field: req.body.field, value: req.body.value },
          (err, done) => {
            if (err) {
              res.json({ message: "Something went wrong." });
              //res.redirect('/admin/settings');
            } else {
              res.json({ message: "Added successfully." });
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
          res.json({ message: "Something went wrong." });
          //res.redirect('/admin/settings');
        } else {
          res.json({ message: "Deleted successfully." });
          //res.redirect('/admin/settings');
        }
      });
    }
  });
};

// add delete user, resource, blog and there respective references in the database
