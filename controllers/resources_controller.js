const cloudinary = require("cloudinary");
require("dotenv").config();

//import schemas
const Resource = require("../models/Resource");
const Like = require("../models/Like");
const Comment = require("../models/Comment");
const Setting = require("../models/Setting");

module.exports.index = (req, res) => {
  //additional feature can be showing total likes and comments on the all resource page and also user name who has added that resource
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

module.exports.view = async (req, res) => {
  const resources = await Resource.findOne({ _id: req.params.id }).populate(
    "user"
  );
  const likes = await Like.find({ for: req.params.id });
  const comments = await Comment.find({ for: req.params.id })
    .sort({ date: "desc" })
    .populate("user");
  let totalLikes = likes.length,
    totalComments = comments.length;
  if (resources) {
    res.json({ resources, totalLikes, totalComments, comments });
  } else {
    res.sendStatus(404);
  }
};

module.exports.filter = async (req, res) => {
  let { byCat, byType } = req.body;
  let categories = byCat; // ['web','android']
  let types = byType; // ['book','article']

  if (categories.length === 0) {
    resource = await Resource.find({ type: { $in: types } });
  } else if (types.length === 0) {
    resource = await Resource.find({ category: { $in: categories } });
  } else {
    resource = await Resource.find({
      $and: [{ category: { $in: categories } }, { type: { $in: types } }]
    });
  }

  // console.log(categories, types);
  if (resource.length === 0) {
    // console.log("this ran");
    res.json({ message: "No Match" });
  } else {
    res.json(resource);
  }
};

module.exports.like = async (req, res) => {
  const isResource = await Resource.findOne({ _id: req.params.id });
  if (isResource) {
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
  const isResource = await Resource.findOne({ _id: req.params.id });
  if (isResource) {
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
  Setting.find({ for: "resources" }).then(settings => {
    res.json({ settings });
  });
};

module.exports.addprocess = (req, res) => {
  const { type, category, name, source, details } = req.body;
  if (!type || !category || !name || !source || !details) {
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
      source: req.body.source,
      details: req.body.details,
      img: { id: req.file.public_id, url: req.file.url },
      user: req.auth.id
    },
    (err, done) => {
      if (err) {
        res.json({ message: "Something went wrong." });
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
    // we are delete just for the sake of it because we already get the image in before GET  route and it gets reuploaded
    cloudinary.v2.api.delete_resources([result.img.id], (error, done) => {
      console.log(done);
    });
    result.type = req.body.type;
    result.category = req.body.category;
    result.name = req.body.name;
    result.source = req.body.source;
    result.details = req.body.details;
    (result.img = { id: req.file.public_id, url: req.file.url }),
      (result.user = req.auth.id);
    result.save().then(result => {
      res.json({ message: "Resource updated successfully." });
    });
  });
};

module.exports.delete = async (req, res) => {
  Resource.findOne({ _id: req.params.id }).then(resource => {
    cloudinary.v2.api.delete_resources([resource.img.id], (error, done) => {
      console.log(done);
      Resource.deleteOne({ _id: resource._id }, (err, done) => {
        if (err) {
          res.json({ message: "Something went wrong." });
        } else {
          res.json({ message: "Resource deleted successfully." });
        }
      });
    });
  });
  //deleting all likes related to that resource
  await Like.deleteMany({ for: req.params.id });
  await Comment.deleteMany({ for: req.params.id });
};

module.exports.all = (req, res) => {
  Resource.find().then(resource => {
    res.json(resource);
  });
};
