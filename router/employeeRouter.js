const express = require("express");
const router = express.Router();
const employeeController = require('../controllers/employeeController')

const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

// Welcome Page
router.get("/", ensureAuthenticated, employeeController.getAdminWelcomePage);



// counter for attendants
router.get("/create-sales", ensureAuthenticated, employeeController.counterForm);


// all-deliveries
router.get("/all-deliveries", ensureAuthenticated, employeeController.allPendingDelivery);
router.get("/all-deliveries/:id", ensureAuthenticated, employeeController.oneDelivery);
// finish delivery
router.get("/finish-order/:id", ensureAuthenticated, employeeController.finishDelivery);




// router.get("/return", ensureAuthenticated, employeeController.createReturn); // to get sales id


// router.post("/return", ensureAuthenticated, employeeController.returnProcessor);


module.exports = router;
