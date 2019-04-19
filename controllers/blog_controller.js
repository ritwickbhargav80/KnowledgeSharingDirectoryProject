const mongoose = require("mongoose");
const flash = require("connect-flash");
const axios = require("axios");
const cloudinary = require("cloudinary");
require("dotenv").config();

//image upload functionality
const imgupload = require("../config/imgupload");

//import schemas
const Blog = require("../models/Blog");
const Like = require("../models/Like");
const Comment = require("../models/Comment");
const Setting = require("../models/Setting");

module.exports.index = (req, res) => {
  //additional feature can be showing total likes and comments on the all blog page and also user name who has added that resource
  Blog.find()
    .sort({ date: "desc" })
    .then(blogs => {
      Setting.find({ for: "blogs" }).then(settings => {
        res.json({
          blogs,
          settings
        });
      });
    });
};

module.exports.view = async (req, res) => {
  const blogs = await Blog.findOne({ _id: req.params.id }).populate("user");
  const likes = await Like.find({ for: req.params.id });
  const comments = await Comment.find({ for: req.params.id }).populate("user");
  let totalLikes = likes.length,
    totalComments = comments.length;
  if (blogs) {
    res.json({ blogs, totalLikes, totalComments, comments });
  } else {
    res.sendStatus(404);
  }
};

module.exports.filter = (req, res) => {
  var category = String(req.body.category).toLowerCase();

  if (category !== "undefined") {
    Blog.find({ category: { $in: category } })
      .sort({ date: "desc" })
      .then(blogs => {
        res.json({ blogs });
      });
  } else {
    Blog.find()
      .sort({ date: "desc" })
      .then(blogs => {
        res.json({ blogs });
      });
  }
};

module.exports.like = async (req, res) => {
  const isBlog = await Blog.findOne({ _id: req.params.id });
  if (isBlog) {
    const alreadyLiked = await Like.findOne({
      user: req.auth.id,
      for: req.params.id
    });
    if (alreadyLiked) {
      res.json({ message: "Already Liked once!" });
    } else {
      Like.create({ user: req.auth.id, for: req.params.id }, (err, done) => {
        if (err) throw err;
        else {
          res.json({ message: "Success" });
        }
      });
    }
  } else {
    res.sendStatus(404);
  }
};

module.exports.comment = async (req, res) => {
  const isBlog = await Blog.findOne({ _id: req.params.id });
  if (isBlog) {
    Comment.create(
      { for: req.params.id, comment: req.body.comment, user: req.auth.id },
      (err, done) => {
        if (err) throw err;
        else {
          res.json({ message: "user commented" });
        }
      }
    );
  } else {
    res.sendStatus(404);
  }
};

module.exports.add = (req, res) => {
  Setting.find({ for: "blogs" }).then(result => {
    res.json({ settings: result });
  });
};

module.exports.addprocess = (req, res) => {
  const { title, category, details } = req.body;
  if (!category || !title || !details) {
    res.json({ message: "All fields compulsary." });
  }
  if (!req.file.url) {
    res.json({ message: "Please upload an image." });
  }
  Blog.create(
    {
      category: req.body.category,
      title: req.body.title,
      details: req.body.details,
      img: { id: req.file.public_id, url: req.file.url },
      user: req.auth.id
    },
    (err, done) => {
      if (err) {
        res.json({ message: "Something went wrong." });
      } else {
        res.json({ message: "Blog added successfully." });
      }
    }
  );
};

module.exports.update = (req, res) => {
  Blog.findOne({ _id: req.params.id }).then(result => {
    Setting.find({ for: "blogs" }).then(setting => {
      res.json({ blogs: result, settings: setting });
    });
  });
};

module.exports.updateprocess = (req, res) => {
  Blog.findOne({ _id: req.params.id }).then(result => {
    cloudinary.v2.api.delete_resources([result.img.id], (error, done) => {
      console.log(done);
    });
    result.category = req.body.category;
    result.title = req.body.title;
    result.details = req.body.details;
    (result.img = { id: req.file.public_id, url: req.file.url }),
      (result.user = req.auth.id);
    result.save().then(result => {
      res.json({ message: "Blog updated successfully." });
    });
  });
};

module.exports.delete = async (req, res) => {
  Blog.findOne({ _id: req.params.id }).then(result => {
    cloudinary.v2.api.delete_resources([result.img.id], (error, done) => {
      console.log(done);
      Blog.deleteOne({ _id: req.params.id }, (err, done) => {
        if (err) {
          res.json({ message: "Something went wrong." });
        } else {
          res.json({ message: "Blog deleted successfully." });
        }
      });
    });
  });

  //deleting all likes related to that resource
  await Like.deleteMany({ for: req.params.id });
  await Comment.deleteMany({ for: req.params.id });
};

module.exports.all = (req, res) => {
  Blog.find().then(blog => {
    res.json(blog);
  });
};
