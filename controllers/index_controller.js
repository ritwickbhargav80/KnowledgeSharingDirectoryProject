const mongoose = require("mongoose");
const axios = require("axios");

require("dotenv").config();

module.exports.index = (req, res) => {
  res.json({ message: "KSD API" });
  // Resource.find()
  //   .sort({ date: "desc" })
  //   .then(resource => {
  //     Blog.find()
  //       .sort({ date: "desc" })
  //       .then(blog => {
  //         axios
  //           .get("https://contesttrackerapi.herokuapp.com")
  //           .then(response => {
  //             res.json({
  //               resources: resource,
  //               blogs: blog,
  //               ongoing: response.data.result.ongoing,
  //               upcoming: response.data.result.upcoming
  //             });
  //           });
  //       });
  //   });
};

module.exports.sendmessage = (req, res) => {
  let { name, email, phone, message } = req.body;
  Message.create(req.body, (err, done) => {
    if (err) throw err;
    else {
      req.json({ message: "Your message has been submitted successfully." });
      //res.redirect('back');
    }
  });
};

module.exports.allmessage = (req, res) => {
  //   console.log(Message);
  Message.find()
    .sort({ date: "desc" })
    .then(messages => {
      res.json(messages);
    });
};
