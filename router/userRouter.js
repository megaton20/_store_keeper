const express = require('express');
const router = express.Router();
const stateData = require("../model/stateAndLGA");
const db = require("../model/databaseTable");
const { isUser } = require("../config/isUser");

const multer = require('multer');
const path = require('path')
const fs = require('fs');


// Ensure the /uploads directory exists
const uploadDir = path.join(__dirname,"..", 'public/uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


const uploadSingle = upload.single('image');


const { ensureAuthenticated } = require('../config/auth');
const userController  = require('../controllers/userController');


router.get("/profile", ensureAuthenticated,isUser, userController.profilePage);
router.get("/edit-user/:id", ensureAuthenticated,isUser, userController.editProfilePage);
router.post("/add-profile-image/:id", ensureAuthenticated,isUser,uploadSingle, userController.updateImage);
router.put("/updata-user-info/:id", ensureAuthenticated,isUser, userController.updateUserInfo);

// users cart
router.get("/", ensureAuthenticated,isUser, userController.counterForm);


router.get('/fetchCart', ensureAuthenticated,isUser,userController.fetchCart);

// submit-cart
router.get("/order/:reference", ensureAuthenticated,isUser, userController.submitCart);


router.get("/orders", ensureAuthenticated,isUser, userController.allUserOder);
router.get("/invoice/:id", ensureAuthenticated,isUser, userController.invoice);
router.put("/cancel-order/:id", ensureAuthenticated,isUser, userController.cancelOrder);



module.exports = router;