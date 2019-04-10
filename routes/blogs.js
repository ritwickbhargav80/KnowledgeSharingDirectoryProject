const express=require('express');
const router=express.Router();

//controller
const resourcesController = require('../controllers/resources_controller');

//configurations
const authcheck = require('../config/authcheck');
const imgupload=require('../config/imgupload');

//resources index router
router.get('/', authcheck.isLoggedIn, resourcesController.index);
//Export router
module.exports=router;