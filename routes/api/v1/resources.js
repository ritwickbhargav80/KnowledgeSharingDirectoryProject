const express=require('express');
const router=express.Router();

//controller
const resourcesController = require('../../../controllers/resources_controller');

//configurations
const authcheck = require('../../../config/authcheck');
const imgupload=require('../../../config/imgupload');

//resources index router
router.get('/', authcheck.isLoggedIn, resourcesController.index);
// view resource
router.get('/view/:id', authcheck.isLoggedIn, resourcesController.view);
//search
router.post('/', authcheck.isLoggedIn, resourcesController.search);
//like
router.get('/like/:id',authcheck.isLoggedIn, resourcesController.like);
 //comment
router.post('/comment/:id', authcheck.isLoggedIn, resourcesController.comment);
//add resource route
router.get('/add', authcheck.isAdmin, resourcesController.add);
//add resource process
router.post('/add', authcheck.isAdmin, imgupload.upload.single('image'), rosurcesController.addprocess);
//update route
router.get('/update/:id', authcheck.isAdmin resourcesController.update);
//update process
router.post('/update/:id',authcheck.isAdmin, imgupload.upload.single('image'), resourcesController.updateprocess);
//delete route
router.get('/delete/:id', authcheck.isAdmin, resourcesController.delete);

router.get('/all', resourcesController.all);
//Export router
module.exports=router;