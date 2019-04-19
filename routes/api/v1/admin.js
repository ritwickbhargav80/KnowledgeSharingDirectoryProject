const express = require("express");
const router = express.Router();

//Controllers
const adminController = require("../../../controllers/admin_controller");

//authcheck
const verifyAuth = require("../../../config/jwt");
const authcheck = require("../../../config/authcheck");

router.get("/", verifyAuth.receiveAndVerifyAdminToken, adminController.index);
//Users mgmt
router.get(
  "/users",
  verifyAuth.receiveAndVerifyAdminToken,
  adminController.users
);
//router.post('/delete-user/:id', verifyAuth.receiveAndVerifyAdminToken, adminController.deleteuser);
//Settings
router.get(
  "/settings",
  verifyAuth.receiveAndVerifyAdminToken,
  adminController.settings
);
router.post(
  "/add-setting",
  verifyAuth.receiveAndVerifyAdminToken,
  adminController.addsetting
);
router.get(
  "/delete-setting/:id",
  verifyAuth.receiveAndVerifyAdminToken,
  adminController.deletesetting
);

//export router
module.exports = router;

// How to be an admin:
// 1. Change role from student to admin in database
// 2. Logout from the browser to remove previously stored token.
// 3. Login again to generate new token with admin previleges
