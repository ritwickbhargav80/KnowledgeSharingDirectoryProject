const jwt = require("jsonwebtoken");

module.exports = createToken = user => {
  return jwt.sign(
    {
      //remember to change this auth.id
      id: user.googleID,
      role: user.role
    },
    process.env.SECRET_KEY
  );
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
