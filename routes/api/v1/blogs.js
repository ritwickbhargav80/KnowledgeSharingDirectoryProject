const router = require("express").Router();

//controller
const blogController = require("../../../controllers/blog_controller");

//configurations
const verifyAuth = require("../../../config/jwt");
const imgupload = require("../../../config/imgupload");

//blog index router
router.get("/", verifyAuth.receiveAndVerifyToken, blogController.index);
// view blog
router.get("/view/:id", verifyAuth.receiveAndVerifyToken, blogController.view);
//search
router.post("/", verifyAuth.receiveAndVerifyToken, blogController.filter);
//like
router.get("/like/:id", verifyAuth.receiveAndVerifyToken, blogController.like);
//comment
router.post(
  "/comment/:id",
  verifyAuth.receiveAndVerifyToken,
  blogController.comment
);
//add blog route
router.get("/add", verifyAuth.receiveAndVerifyAdminToken, blogController.add);
//add blog process
router.post(
  "/add",
  verifyAuth.receiveAndVerifyAdminToken,
  imgupload.upload.single("image"),
  blogController.addprocess
);
//update route
router.get(
  "/update/:id",
  verifyAuth.receiveAndVerifyAdminToken,
  blogController.update
);
//update process
router.post(
  "/update/:id",
  verifyAuth.receiveAndVerifyAdminToken,
  imgupload.upload.single("image"),
  blogController.updateprocess
);
//delete route
router.get(
  "/delete/:id",
  verifyAuth.receiveAndVerifyAdminToken,
  blogController.delete
);

router.get("/all", blogController.all);
//Export router
module.exports = router;
