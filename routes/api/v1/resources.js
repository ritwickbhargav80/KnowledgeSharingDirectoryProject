const express = require("express");
const router = express.Router();

//controller
const resourcesController = require("../../../controllers/resources_controller");

//configurations
const verifyAuth = require("../../../config/jwt");
const authcheck = require("../../../config/authcheck");
const imgupload = require("../../../config/imgupload");

//resources index router
router.get("/", verifyAuth.receiveAndVerifyToken, resourcesController.index);
// view resource
router.get(
  "/view/:id",
  verifyAuth.receiveAndVerifyToken,
  resourcesController.view
);
//search
router.post("/", verifyAuth.receiveAndVerifyToken, resourcesController.filter);
//like
router.get(
  "/like/:id",
  verifyAuth.receiveAndVerifyToken,
  resourcesController.like
);
//comment
router.post(
  "/comment/:id",
  verifyAuth.receiveAndVerifyToken,
  resourcesController.comment
);
//add resource route
router.get(
  "/add",
  verifyAuth.receiveAndVerifyAdminToken,
  resourcesController.add
);
//add resource process
router.post(
  "/add",
  verifyAuth.receiveAndVerifyAdminToken,
  imgupload.upload.single("image"),
  resourcesController.addprocess
);
//update route
router.get(
  "/update/:id",
  verifyAuth.receiveAndVerifyAdminToken,
  resourcesController.update
);
//update process
router.post(
  "/update/:id",
  verifyAuth.receiveAndVerifyAdminToken,
  imgupload.upload.single("image"),
  resourcesController.updateprocess
);
//delete route
router.get(
  "/delete/:id",
  verifyAuth.receiveAndVerifyAdminToken,
  resourcesController.delete
);

router.get("/all", resourcesController.all);
//Export router
module.exports = router;
