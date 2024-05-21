const express = require("express");
const router = express.Router();
const adminController = require('../controllers/adminController')
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

router.post('/add-image/:id',ensureAuthenticated,uploadSingle,adminController.upload)

// Welcome Page
router.get("/", ensureAuthenticated, adminController.getAdminWelcomePage);

// all table Page
router.get("/all-customers", ensureAuthenticated, adminController.getAllCustomers);
router.get("/all-sales", ensureAuthenticated, adminController.getAllSales);
router.get("/all-damaged", ensureAuthenticated, adminController.getAllDamaged);
router.get("/all-employees", ensureAuthenticated, adminController.getAllEmployees);
router.get("/all-supplier", ensureAuthenticated, adminController.getAllSuppliers);
router.get("/all-stores", ensureAuthenticated, adminController.getAllStores);
router.get("/all-categories", ensureAuthenticated, adminController.getAllCategory);
router.get("/all-discounts", ensureAuthenticated, adminController.getAllDiscounts);
router.get("/all-products", ensureAuthenticated, adminController.getAllProducts);
router.get("/all-transactions", ensureAuthenticated, adminController.getAllTransactions);
router.get("/all-inventory", ensureAuthenticated, adminController.getAllInventory);
router.get("/all-positions", ensureAuthenticated, adminController.getAllPositions);
router.get("/all-orders", ensureAuthenticated, adminController.getAllOrrders);
router.get("/upgrade-users", ensureAuthenticated, adminController.getAllUsersToUpgrade);


router.get("/upgrade-users/:id", ensureAuthenticated, adminController.usersToUpgrade);
router.put("/upgrade-users/:id", ensureAuthenticated, adminController.postUsersToUpgrade);
// get single
router.get("/inventory/:id", ensureAuthenticated, adminController.getInventoryById);



// counter for attendants
router.get("/create-sales", ensureAuthenticated, adminController.counterForm);




router.get("/view-order/:id", ensureAuthenticated, adminController.getSingleOrder);
router.get("/confirm-order/:id", ensureAuthenticated, adminController.confirmOrder);
router.post("/ship-order/:id", ensureAuthenticated, adminController.completeOrder);


// post request
router.post("/create-store", ensureAuthenticated, adminController.createNewStore);
router.post("/create-discount", ensureAuthenticated, adminController.createNewDiscount);
router.post("/create-inventory", ensureAuthenticated, adminController.createNewInventory);
router.post("/create-category", ensureAuthenticated, adminController.createNewCategory);
router.post("/create-supplier", ensureAuthenticated, adminController.createNewSupplier);
router.post("/create-customer", ensureAuthenticated, adminController.createNewCustomer);
router.post("/create-position", ensureAuthenticated, adminController.createNewPosition);



// // add to store
router.put('/product-status/unverified/:id',ensureAuthenticated,adminController.remove)
// add price for new store item to add to market
router.post("/create-sales/:id", ensureAuthenticated, adminController.createNewSalesItem);
router.put("/resolve/:id", ensureAuthenticated, adminController.resolveSale);
router.put("/flag-product/:id", ensureAuthenticated, adminController.flagProduct);
router.put("/unflag-product/:id", ensureAuthenticated, adminController.unflagProduct);





router.get("/edit-stores/:id", ensureAuthenticated, adminController.storeEdit);
router.get("/edit-discount/:id", ensureAuthenticated,adminController.editDiscount);
router.get("/edit-supplier/:id", ensureAuthenticated, adminController.editSupplier)
router.get("/edit-category/:id", ensureAuthenticated, adminController.editCategory)
router.get("/edit-Inventory/:id", ensureAuthenticated, adminController.editInventory)
router.get("/edit-position/:id", ensureAuthenticated, adminController.editPosition);
router.get("/edit-employee/:id", ensureAuthenticated, adminController.editEmployee);







router.put("/edit-employee/:id", ensureAuthenticated, adminController.updateEmployee);
router.put("/edit-store/:id", ensureAuthenticated, adminController.editNewStore);
router.put("/edit-discount/:id", ensureAuthenticated, adminController.editNewDiscount);
router.put("/edit-supplier/:id", ensureAuthenticated, adminController.editNewSupplier);
router.put("/edit-category/:id", ensureAuthenticated, adminController.editNewCategory);
router.put("/edit-inventory/:id", ensureAuthenticated, adminController.editNewInventory);
router.put("/edit-position/:id", ensureAuthenticated, adminController.editNewPosition);
// router.put("/edit-customer/:id", ensureAuthenticated, adminController.editNewCustomer);



// delete

router.delete("/delete-store/:id", ensureAuthenticated, adminController.deleteStore);
router.delete("/delete-employee/:id", ensureAuthenticated, adminController.deleteEmployee);
router.delete("/delete-discount/:id", ensureAuthenticated, adminController.deleteDiscount);
router.delete("/delete-supplier/:id", ensureAuthenticated, adminController.deleteSupplier);
router.delete("/delete-category/:id", ensureAuthenticated, adminController.deleteCategory);
router.delete("/delete-inventory/:id", ensureAuthenticated, adminController.deleteInventory);
router.delete("/delete-position/:id", ensureAuthenticated, adminController.deletePosition);
// router.put("/edit-customer/:id", ensureAuthenticated, adminController.editNewCustomer);
module.exports = router;
