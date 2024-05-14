const express = require("express");
const router = express.Router();
const employeeController = require('../controllers/employeeController')

const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

// Welcome Page
router.get("/", ensureAuthenticated, employeeController.getAdminWelcomePage);



// counter for attendants
router.get("/create-sales", ensureAuthenticated, employeeController.counterForm);


// router.get("/return", ensureAuthenticated, employeeController.createReturn); // to get sales id


// router.post("/return", ensureAuthenticated, employeeController.returnProcessor);


module.exports = router;
