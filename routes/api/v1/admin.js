const express = require("express");
const router = express.Router();

//Controllers
const adminController = require("../../../controllers/admin_controller");

//authcheck
const authcheck = require("../../../config/authcheck");

//admin login
// router.get('/login', authcheck.logggedInAlready, adminController.login);
// router.post("/login", adminController.loginpost);
//index Router-admin dashboard
router.get("/", authcheck.isAdmin, adminController.index);
//Users mgmt
router.get("/users", authcheck.isAdmin, adminController.users);
//router.post('/delete-user/:id', authcheck.isAdmin, adminController.deleteuser);
//Settings
router.get("/settings", authcheck.isAdmin, adminController.settings);
router.post("/add-setting", authcheck.isAdmin, adminController.addsetting);
router.post(
  "/delete-setting/:id",
  authcheck.isAdmin,
  adminController.deletesetting
);

//export router
module.exports = router;
