const router = require("express").Router();

//controller
const indexController = require("../../../controllers/index_controller");

//index
router.get("/", indexController.index);
//contact us post
router.post("/contact", indexController.sendmessage);

//export router
module.exports = router;
