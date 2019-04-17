const jwt = require("jsonwebtoken");

const createToken = auth => {
  return jwt.sign(
    {
      //remember to change this auth.id
      id: auth.id,
      role: auth.role
    },
    process.env.SECRET_KEY
  );
};

module.exports = {
  generateToken: (req, res, next) => {
    req.token = createToken(req.auth);
    return next();
  },
  verifyToken: (req, res, next) => {
    jwt.verify(req.token, process.env.SECRET_KEY, (err, authData) => {
      if (err) {
        res.json({ message: "Forbidden" });
      } else {
        res.json({
          message: "Authenticated",
          user: authData
        });
      }
    });
  }
};
