const express = require("express");
const router = express.Router();
const User = require("../../../models/User");

//controller
const userController = require("../../../controllers/user_controller");
//token auth check
const jwt = require("../../../config/jwt");

//generate token to store in browser
router.get("/loginTokenGenerate", userController.generateAndSendToken);

//protect routes via token verfication
router.get("/protected", jwt.receiveAndVerifyToken, (req, res) => {
  res.json(req.auth);
});
//for database: to be removed
router.get("/user", async (req, res) => {
  const user = await User.find({});
  const admin = await Admin.find({});
  const data = { user, admin };
  // User.deleteMany({ name: "keshav" }).then(res => {
  //   console.log("done");
  // });
  res.json(data);
});

//export router
module.exports = router;
