const express = require("express");
const router = express.Router();
const passport = require("passport");
require("../../../config/passportgoogle")(passport);
const User = require("../../../models/User");
const Admin = require("../../../models/Admin");

//controller
const userController = require("../../../controllers/user_controller");
//authcheck
const authcheck = require("../../../config/authcheck");

//register route
// router.post("/register", userController.registerprocess);
//register process
//router.post('/register',  authcheck.logggedInAlready, userController.registerprocess);
//login route
router.get(
  "/login",
  authcheck.loggedInAlready,
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/login/google/callback",
  authcheck.loggedInAlready,
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.json(req.user);
  }
);
//for database: to be removed
// router.get("/user", async (req, res) => {
//   const user = await User.find({});
//   const admin = await Admin.find({});
//   const data = { user, admin };
//   res.json(data);
// });
//logout route
router.get("/logout", userController.logout);

//export router
module.exports = router;
