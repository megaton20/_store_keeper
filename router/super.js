const express = require("express");
const router = express.Router();
const adminController = require('../controllers/adminController')
const { isSuper } = require("../config/super");
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



const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

router.post('/add-image/:id',ensureAuthenticated,isSuper,uploadSingle,adminController.upload)

// Welcome Page
router.get("/", ensureAuthenticated,isSuper, adminController.getAdminWelcomePage);

// all table Page
router.get("/all-customers", ensureAuthenticated,isSuper, adminController.getAllCustomers);
router.get("/all-sales", ensureAuthenticated,isSuper, adminController.getAllSales);
router.get("/all-damaged", ensureAuthenticated,isSuper, adminController.getAllDamaged);
router.get("/all-employees", ensureAuthenticated,isSuper, adminController.getAllEmployees);
router.get("/all-supplier", ensureAuthenticated,isSuper, adminController.getAllSuppliers);
router.get("/all-stores", ensureAuthenticated,isSuper, adminController.getAllStores);
router.get("/all-categories", ensureAuthenticated,isSuper, adminController.getAllCategory);
router.get("/all-discounts", ensureAuthenticated,isSuper, adminController.getAllDiscounts);
router.get("/all-products", ensureAuthenticated,isSuper, adminController.getAllProducts);
router.get("/all-transactions", ensureAuthenticated,isSuper, adminController.getAllTransactions);
router.get("/all-inventory", ensureAuthenticated,isSuper, adminController.getAllInventory);
router.get("/all-positions", ensureAuthenticated,isSuper, adminController.getAllPositions);
router.get("/all-orders", ensureAuthenticated,isSuper, adminController.getAllOrrders);
router.get("/upgrade-users", ensureAuthenticated,isSuper, adminController.getAllUsersToUpgrade);


router.get("/upgrade-users/:id", ensureAuthenticated,isSuper, adminController.usersToUpgrade);
router.put("/upgrade-users/:id", ensureAuthenticated,isSuper, adminController.postUsersToUpgrade);
// get single
router.get("/inventory/:id", ensureAuthenticated,isSuper, adminController.getInventoryById);



// counter for attendants
router.get("/create-sales", ensureAuthenticated,isSuper, adminController.counterForm);
router.get("/invoice/:id", ensureAuthenticated,isSuper, adminController.invoice);



router.get("/view-order/:id", ensureAuthenticated,isSuper, adminController.getSingleOrder);
router.get("/confirm-order/:id", ensureAuthenticated,isSuper, adminController.confirmOrder);
router.post("/ship-order/:id", ensureAuthenticated,isSuper, adminController.completeOrder);


// post request
router.post("/create-store", ensureAuthenticated,isSuper, adminController.createNewStore);
router.post("/create-discount", ensureAuthenticated,isSuper, adminController.createNewDiscount);
router.post("/create-inventory", ensureAuthenticated,isSuper, adminController.createNewInventory);
router.post("/create-category", ensureAuthenticated,isSuper, adminController.createNewCategory);
router.post("/create-supplier", ensureAuthenticated,isSuper, adminController.createNewSupplier);
router.post("/create-customer", ensureAuthenticated,isSuper, adminController.createNewCustomer);
router.post("/create-position", ensureAuthenticated,isSuper, adminController.createNewPosition);



// // add to store
router.put('/product-status/unverified/:id',ensureAuthenticated,isSuper,adminController.remove)
// add price for new store item to add to market
router.post("/create-sales/:id", ensureAuthenticated,isSuper, adminController.createNewSalesItem);
router.put("/resolve/:id", ensureAuthenticated,isSuper, adminController.resolveSale);
router.put("/flag-product/:id", ensureAuthenticated,isSuper, adminController.flagProduct);
router.put("/unflag-product/:id", ensureAuthenticated,isSuper, adminController.unflagProduct);





router.get("/edit-stores/:id", ensureAuthenticated,isSuper, adminController.storeEdit);
router.get("/edit-discount/:id", ensureAuthenticated,isSuper,adminController.editDiscount);
router.get("/edit-supplier/:id", ensureAuthenticated,isSuper, adminController.editSupplier)
router.get("/edit-category/:id", ensureAuthenticated,isSuper, adminController.editCategory)
router.get("/edit-Inventory/:id", ensureAuthenticated,isSuper, adminController.editInventory)
router.get("/edit-position/:id", ensureAuthenticated,isSuper, adminController.editPosition);
router.get("/edit-employee/:id", ensureAuthenticated,isSuper, adminController.editEmployee);







router.put("/edit-employee/:id", ensureAuthenticated,isSuper, adminController.updateEmployee);
router.put("/edit-store/:id", ensureAuthenticated,isSuper, adminController.editNewStore);
router.put("/edit-discount/:id", ensureAuthenticated,isSuper, adminController.editNewDiscount);
router.put("/edit-supplier/:id", ensureAuthenticated,isSuper, adminController.editNewSupplier);
router.put("/edit-category/:id", ensureAuthenticated,isSuper, adminController.editNewCategory);
router.put("/edit-inventory/:id", ensureAuthenticated,isSuper, adminController.editNewInventory);
router.put("/edit-position/:id", ensureAuthenticated,isSuper, adminController.editNewPosition);
// router.put("/edit-customer/:id", ensureAuthenticated,isSuper, adminController.editNewCustomer);



// delete

router.delete("/delete-store/:id", ensureAuthenticated,isSuper, adminController.deleteStore);
router.delete("/delete-employee/:id", ensureAuthenticated,isSuper, adminController.deleteEmployee);
router.delete("/delete-discount/:id", ensureAuthenticated,isSuper, adminController.deleteDiscount);
router.delete("/delete-supplier/:id", ensureAuthenticated,isSuper, adminController.deleteSupplier);
router.delete("/delete-category/:id", ensureAuthenticated,isSuper, adminController.deleteCategory);
router.delete("/delete-inventory/:id", ensureAuthenticated,isSuper, adminController.deleteInventory);
router.delete("/delete-position/:id", ensureAuthenticated,isSuper, adminController.deletePosition);
// router.put("/edit-customer/:id", ensureAuthenticated,isSuper, adminController.editNewCustomer);
module.exports = router;
