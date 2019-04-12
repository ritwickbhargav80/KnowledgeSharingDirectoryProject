const express = require('express');
const router = express.Router();

//Controllers
const contestsController = require('../../../controllers/contests_controller');

//Ongoing Contests
router.get('/ongoing', contestsController.ongoing);
//upcoming Contests
router.get('/upcoming', contestsController.upcoming);

//export router
module.exports = router;