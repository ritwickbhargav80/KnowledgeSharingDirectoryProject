//load user model
const User = require("../models/User");
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
