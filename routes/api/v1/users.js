const express = require("express");
const router = express.Router();
const User = require("../../../models/User");
// const Like = require("../../../models/Like");

//controller
const userController = require("../../../controllers/user_controller");
//token auth check
const verifyAuth = require("../../../config/jwt");

//generate token to store in browser when user try to login everytime
router.get("/loginTokenGenerate", userController.generateAndSendToken);

//protect routes via token verfication
router.get("/protected", verifyAuth.receiveAndVerifyToken, (req, res) => {
  res.json(req.user);
});
//for database: to be removed
router.get("/user", async (req, res) => {
  const user = await User.find({});
  const admin = await Admin.find({});
  const data = { user, admin };
  // User.deleteMany({ name: "keshav" }).then(res => {
  //   console.log("done");
  // });
  // Like.deleteMany({ user: "5cb86a10dfcf372e6c38a581" }).then(res => {
  //   console.log("done");
  // });
  res.json(data);
});

//export router
module.exports = router;
