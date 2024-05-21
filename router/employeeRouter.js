const express = require("express");
const router = express.Router();
const employeeController = require('../controllers/employeeController')

const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const { isAttendant } = require("../config/employee");

// Welcome Page
router.get("/", ensureAuthenticated,isAttendant, employeeController.getAdminWelcomePage);



// counter for attendants
router.get("/create-sales", ensureAuthenticated,isAttendant, employeeController.counterForm);


router.get("/invoice/:id", ensureAuthenticated,isAttendant, employeeController.invoice);


module.exports = router;
