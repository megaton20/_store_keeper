const express = require("express");
const router = express.Router();
const superController = require('../controllers/superController')
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

router.post('/add-image/:id',ensureAuthenticated,isSuper,uploadSingle,superController.upload)

// Welcome Page
router.get("/", ensureAuthenticated,isSuper, superController.getAdminWelcomePage);

// all table Page
router.get("/all-customers", ensureAuthenticated,isSuper, superController.getAllCustomers);
router.get("/all-sales", ensureAuthenticated,isSuper, superController.getAllSales);
router.get("/all-damaged", ensureAuthenticated,isSuper, superController.getAllDamaged);
router.get("/all-employees", ensureAuthenticated,isSuper, superController.getAllEmployees);
router.get("/all-supplier", ensureAuthenticated,isSuper, superController.getAllSuppliers);
router.get("/all-stores", ensureAuthenticated,isSuper, superController.getAllStores);
router.get("/all-categories", ensureAuthenticated,isSuper, superController.getAllCategory);
router.get("/all-discounts", ensureAuthenticated,isSuper, superController.getAllDiscounts);
router.get("/all-products", ensureAuthenticated,isSuper, superController.getAllProducts);
router.get("/all-transactions", ensureAuthenticated,isSuper, superController.getAllTransactions);
router.get("/all-inventory", ensureAuthenticated,isSuper, superController.getAllInventory);
router.get("/all-positions", ensureAuthenticated,isSuper, superController.getAllPositions);
router.get("/all-orders", ensureAuthenticated,isSuper, superController.getAllOrrders);
router.get("/upgrade-users", ensureAuthenticated,isSuper, superController.getAllUsersToUpgrade);


router.get("/upgrade-users/:id", ensureAuthenticated,isSuper, superController.usersToUpgrade);
router.put("/upgrade-users/:id", ensureAuthenticated,isSuper, superController.postUsersToUpgrade);
// get single
router.get("/inventory/:id", ensureAuthenticated,isSuper, superController.getInventoryById);
router.get("/update-price/:id", ensureAuthenticated,isSuper, superController.updatePrice);



// counter for super
router.get("/create-sales", ensureAuthenticated,isSuper, superController.adminCounter);
router.post("/submitCart", ensureAuthenticated,isSuper, superController.superSale);
router.get("/invoice/:id", ensureAuthenticated,isSuper, superController.invoice);



router.get("/view-order/:id", ensureAuthenticated,isSuper, superController.getSingleOrder);
router.get("/confirm-order/:id", ensureAuthenticated,isSuper, superController.confirmOrder);
router.post("/ship-order/:id", ensureAuthenticated,isSuper, superController.completeOrder);


// post request
router.post("/create-store", ensureAuthenticated,isSuper, superController.createNewStore);
router.post("/create-discount", ensureAuthenticated,isSuper, superController.createNewDiscount);
router.post("/create-inventory", ensureAuthenticated,isSuper, superController.createNewInventory);
router.post("/create-category", ensureAuthenticated,isSuper, superController.createNewCategory);
router.post("/create-supplier", ensureAuthenticated,isSuper, superController.createNewSupplier);
router.post("/create-customer", ensureAuthenticated,isSuper, superController.createNewCustomer);
router.post("/create-position", ensureAuthenticated,isSuper, superController.createNewPosition);



// // add to store
router.put('/product-status/unverified/:id',ensureAuthenticated,isSuper,superController.remove)
// add price for new store item to add to market
router.post("/create-sales/:id", ensureAuthenticated,isSuper, superController.createNewSalesItem);
router.put("/resolve/:id", ensureAuthenticated,isSuper, superController.resolveSale);
router.put("/flag-product/:id", ensureAuthenticated,isSuper, superController.flagProduct);
router.put("/unflag-product/:id", ensureAuthenticated,isSuper, superController.unflagProduct);





router.get("/edit-stores/:id", ensureAuthenticated,isSuper, superController.storeEdit);
router.get("/edit-discount/:id", ensureAuthenticated,isSuper,superController.editDiscount);
router.get("/edit-supplier/:id", ensureAuthenticated,isSuper, superController.editSupplier)
router.get("/edit-category/:id", ensureAuthenticated,isSuper, superController.editCategory)
router.get("/edit-Inventory/:id", ensureAuthenticated,isSuper, superController.editInventory)
router.get("/edit-position/:id", ensureAuthenticated,isSuper, superController.editPosition);
router.get("/edit-employee/:id", ensureAuthenticated,isSuper, superController.editEmployee);







router.put("/edit-employee/:id", ensureAuthenticated,isSuper, superController.updateEmployee);
router.put("/edit-store/:id", ensureAuthenticated,isSuper, superController.editNewStore);
router.put("/edit-discount/:id", ensureAuthenticated,isSuper, superController.editNewDiscount);
router.put("/edit-supplier/:id", ensureAuthenticated,isSuper, superController.editNewSupplier);
router.put("/edit-category/:id", ensureAuthenticated,isSuper, superController.editNewCategory);
router.put("/edit-inventory/:id", ensureAuthenticated,isSuper, superController.editNewInventory);
router.put("/edit-position/:id", ensureAuthenticated,isSuper, superController.editNewPosition);
// router.put("/edit-customer/:id", ensureAuthenticated,isSuper, superController.editNewCustomer);



// delete

router.delete("/delete-store/:id", ensureAuthenticated,isSuper, superController.deleteStore);
router.delete("/delete-employee/:id", ensureAuthenticated,isSuper, superController.deleteEmployee);
router.delete("/delete-discount/:id", ensureAuthenticated,isSuper, superController.deleteDiscount);
router.delete("/delete-supplier/:id", ensureAuthenticated,isSuper, superController.deleteSupplier);
router.delete("/delete-category/:id", ensureAuthenticated,isSuper, superController.deleteCategory);
router.delete("/delete-inventory/:id", ensureAuthenticated,isSuper, superController.deleteInventory);
router.delete("/delete-position/:id", ensureAuthenticated,isSuper, superController.deletePosition);
// router.put("/edit-customer/:id", ensureAuthenticated,isSuper, superController.editNewCustomer);








module.exports = router;
