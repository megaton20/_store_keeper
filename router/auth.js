const express = require("express");
const router = express.Router();
const authController = require("../controllers/authcontroller");




router.post('/login', authController.loginHandler)
router.post('/register', authController.registerHandler)


module.exports = router;
