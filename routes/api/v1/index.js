const router = require("express").Router();

//controller
const indexController = require("../../../controllers/index_controller");

//index
router.get("/", indexController.index);
//contact us post
router.post("/contact", indexController.sendmessage);

router.get("/allmessage", indexController.allmessage);

//export router
module.exports = router;
