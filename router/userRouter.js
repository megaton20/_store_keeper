const express = require('express');
const router = express.Router();
const stateData = require("../model/stateAndLGA");
const db = require("../model/databaseTable");

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const userController  = require('../controllers/userController');



// submit-cart

router.post("/cart", ensureAuthenticated, userController.cartForm);




/**
 * users to make order
 * edit themselevs
 * 
 */

module.exports = router;