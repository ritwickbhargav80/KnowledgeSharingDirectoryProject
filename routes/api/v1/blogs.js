const express=require('express');
const router=express.Router();

//controller
const blogController = require('../../../controllers/blog_controller');

//configurations
const authcheck = require('../../../config/authcheck');
const imgupload=require('../../../config/imgupload');

//resources index router
router.get('/', /*authcheck.isLoggedIn, */blogController.index);
// view resource
router.get('/view/:id', /*authcheck.isLoggedIn, */blogController.view);
//search
router.post('/', /*authcheck.isLoggedIn, */blogController.search);
//like
router.get('/like/:id',/*authcheck.isLoggedIn, */blogController.like);
 //comment
router.post('/comment/:id', /*authcheck.isLoggedIn, */blogController.comment);
//add resource route
router.get('/add', /*authcheck.isAdmin, */blogController.add);
//add resource process
router.post('/add', /*authcheck.isAdmin, */imgupload.upload.single('image'), blogController.addprocess);
//update route
router.get('/update/:id', /*authcheck.isAdmin, */blogController.update);
//update process
router.post('/update/:id',/*authcheck.isAdmin, */imgupload.upload.single('image'), blogController.updateprocess);
//delete route
router.get('/delete/:id', /*authcheck.isAdmin, */blogController.delete);

router.get('/all', blogController.all);
//Export router
module.exports=router;