const router = require("express").Router();

//controller
const userController = require("../../../controllers/user_controller");
//token auth check
const verifyAuth = require("../../../config/jwt");

//generate token to store in browser when user try to login everytime
router.post("/loginTokenGenerate", userController.generateAndSendToken);

//protect routes via token verfication
router.get("/protected", verifyAuth.receiveAndVerifyToken, (req, res) => {
  res.json(req.auth);
});

//export router
module.exports = router;
