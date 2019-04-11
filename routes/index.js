const express = require('express');
const router = express.Router();

//controller
const indexController = require('../controllers/index_controller');

//index
router.get('/', indexController.index);
//about
router.get('/about', indexController.about);
//contactus form
router.get('/contact', indexController.contact);
//contact us post
router.post('/contact', indexController.sendmessage);
router.get('/allmessage', indexController.allmessage);

//export router
module.exports = router;