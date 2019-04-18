const jwt = require("jsonwebtoken");

module.exports = createToken = user => {
  return jwt.sign(
    {
      id: user._id,
      googleID: user.googleID,
      role: user.role,
      name: user.name,
      email: user.email,
      img: user.img
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

module.exports.receiveAndVerifyAdminToken = (req, res, next) => {
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
        if (authData.role === "admin") {
          req.auth = authData;
          next();
        } else {
          res.json({ message: "Admin Login Required" });
        }
      }
    });
    // Next middleware
    //   next();
  } else {
    res.json({ message: "Forbidden" });
  }
};
