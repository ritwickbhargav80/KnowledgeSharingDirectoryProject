const jwt = require("jsonwebtoken");

module.exports.createToken = user => {
  return jwt.sign(
    {
      //remember to change this auth.id
      id: user.googleID,
      role: user.role
    },
    process.env.SECRET_KEY
  );
};

// module.exports = {
//   generateAndSendToken: (req, res) => {
//     const { googleId, imageUrl, email, name } = req.body;
//     const newUser = {
//       googleID: googleId,
//       name: name,
//       email: email,
//       img: imageUrl
//     };
//     User.findOne({ googleID: googleId }).then(user => {
//       if (user) {
//         req.token = createToken(user);
//       } else {
//         new User(newUser).save().then(user => {
//           req.token = createToken(user);
//           console.log("User Created and saved in database!");
//         });
//       }
//     });
//     res.json({ token: req.token });
//   },
//   receiveAndVerifyToken: (req, res, next) => {
//     const bearerHeader = req.headers["authorization"];
//     if (typeof bearerHeader !== "undefined") {
//       // Split at the space
//       const bearerToken = bearerHeader.split(" ")[1];
//       // Set the token
//       req.token = bearerToken;
//       //verify the token
//       jwt.verify(req.token, process.env.SECRET_KEY, (err, authData) => {
//         if (err) {
//           res.json({ message: "Forbidden" });
//         } else {
//           req.auth = authData;
//         }
//       });
//       // Next middleware
//       next();
//     }
//     res.json({ message: "Forbidden" });
//   }
// };
