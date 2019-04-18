const mongoose = require("mongoose");
const flash = require("connect-flash");
const axios = require("axios");
const cloudinary = require("cloudinary");
require("dotenv").config();

//image upload functionality
const imgupload = require("../config/imgupload");

//import schemas
const Resource = require("../models/Resource");
const Like = require("../models/Like");
const Comment = require("../models/Comment");
const Setting = require("../models/Setting");

module.exports.index = (req, res) => {
  Resource.find()
    .sort({ date: "desc" })
    .then(resources => {
      Setting.find({ for: "resources" }).then(settings => {
        res.json({
          resources,
          settings
        });
      });
    });
};

module.exports.view = (req, res) => {
  Resource.findOne({ _id: req.params.id }).then(resources => {
    Like.find({ for: req.params.id }).then(likes => {
      Comment.find({ for: req.params.id })
        .sort({ date: "desc" })
        .then(comments => {
          res.json({ resources, likes, comments });
        });
    });
  });
};

module.exports.filter = (req, res) => {
  var category = String(req.body.category).toLowerCase();
  var type = String(req.body.type).toLowerCase();
  console.log(category, type);
  if (category !== "undefined" && type != "undefined") {
    Resource.find({
      category: { $in: category },
      type: { $in: type }
    })
      .sort({ date: "desc" })
      .then(resources => {
        res.json({ resources });
      });
  } else if (category !== "undefined" && type === "undefined") {
    console.log(category, type);
    Resource.find({ category: { $in: category } })
      .sort({ date: "desc" })
      .then(resources => {
        res.json({ resources });
      });
  } else if (category === "undefined" && type !== "undefined") {
    Resource.find({ type: { $in: type } })
      .sort({ date: "desc" })
      .then(resources => {
        res.json({ resources });
      });
  } else {
    Resource.find()
      .sort({ date: "desc" })
      .then(resources => {
        res.json({ resources });
      });
  }
};

module.exports.like = (req, res) => {
  Like.create({ user: req.auth.id, for: req.params.id }, (err, done) => {
    if (err) throw err;
    else {
      res.json({ message: "Success" });
    }
  });
};

module.exports.comment = (req, res) => {
  Comment.create(
    { for: req.params.id, comment: req.body.comment, user: req.auth.id },
    (err, done) => {
      if (err) throw err;
      else {
        res.json({ message: "user commented" });
      }
    }
  );
};

module.exports.add = (req, res) => {
  Setting.find({ for: "resources" }).then(settings => {
    res.json({ settings });
  });
};

module.exports.addprocess = (req, res) => {
  console.log(req.body);
  console.log(req.auth.name);
  const { type, category, name, author, details } = req.body;
  if (!type || !category || !name || !author || !details) {
    res.json({ message: "All fields compulsary." });
  }
  if (!req.file.url) {
    res.json({ message: "Please upload an image." });
  }
  Resource.create(
    {
      type: req.body.type,
      category: req.body.category,
      name: req.body.name,
      author: req.body.author,
      details: req.body.details,
      img: { id: req.file.public_id, url: req.file.url },
      user: req.auth.name
    },
    (err, done) => {
      if (err) {
        req.json({ message: "Something went wrong." });
      } else {
        res.json({ message: "Resource added successfully." });
      }
    }
  );
};

module.exports.update = (req, res) => {
  Resource.findOne({ _id: req.params.id }).then(result => {
    Setting.find({ for: "resources" }).then(setting => {
      res.json({ resources: result, settings: setting });
    });
  });
};

module.exports.updateprocess = (req, res) => {
  Resource.findOne({ _id: req.params.id }).then(result => {
    cloudinary.v2.api.delete_resources([result.img.id], (error, done) => {
      console.log(done);
    });
    result.type = req.body.type;
    result.category = req.body.category;
    result.name = req.body.name;
    result.author = req.body.author;
    result.details = req.body.details;
    (result.img = { id: req.file.public_id, url: req.file.url }),
      (result.user = req.auth.name);
    result.save().then(result => {
      res.json({ message: "Resource updated successfully." });
      //res.redirect('back');
    });
  });
};

module.exports.delete = (req, res) => {
  Resource.findOne({ _id: req.params.id }).then(resource => {
    // res.json({ resource });
    cloudinary.v2.api.delete_resources([resource.img.id], (error, done) => {
      console.log(done);
    });

    Resource.deleteOne({ _id: resource._id }, (err, done) => {
      if (err) {
        res.json({ message: "Something went wrong." });
        //res.redirect('back');
      } else {
        res.json({ message: "Resource deleted successfully." });
        //res.redirect('back');
      }
    });
  });
};

module.exports.all = (req, res) => {
  Resource.find().then(resource => {
    res.json(resource);
  });
};
