const express = require("express");
const router = express.Router();

//controller
const userController = require("../../../controllers/user_controller");

router.get("/loginTokenGenerate", userController.generateAndSendToken);

//for database: to be removed
// router.get("/user", async (req, res) => {
//   const user = await User.find({});
//   const admin = await Admin.find({});
//   const data = { user, admin };
//   res.json(data);
// });

//export router
module.exports = router;
