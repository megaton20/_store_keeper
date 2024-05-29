const express = require('express');
const router = express.Router();
const stateData = require("../model/stateAndLGA");
const db = require("../model/databaseTable");

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const userController  = require('../controllers/userController');



// users cart
router.get("/", ensureAuthenticated, userController.counterForm);

router.get('/fetchCart', ensureAuthenticated,userController.fetchCart);

// submit-cart
router.get("/order/:email", ensureAuthenticated, userController.submitCart);


router.get("/orders", ensureAuthenticated, userController.allUserOder);
router.get("/invoice/:id", ensureAuthenticated, userController.invoice);



// submit-cart

// landing directly to cart to make your purchase

// get  request to see  wishlist page
// router.get("/", ensureAuthenticated, userController.wishlist);
// put request to save wishlist item
// router.put("/", ensureAuthenticated, userController.addWishlist);
// put request to remove wishlist item
// router.get("/", ensureAuthenticated, userController.removeWishlist);

// profile page

// get rquest to edit page
// put request to send edits



/**
 * users to make order
 * edit themselevs
 * 
 */

module.exports = router;