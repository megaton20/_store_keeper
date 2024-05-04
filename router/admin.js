const express = require("express");
const router = express.Router();
const adminController = require('../controllers/adminController')

const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

// Welcome Page
router.get("/", ensureAuthenticated, adminController.getAdminWelcomePage);


// all table Page
router.get("/all-customers", ensureAuthenticated, adminController.getAllCustomers);
router.get("/all-sales", ensureAuthenticated, adminController.getAllSales);
router.get("/all-damaged", ensureAuthenticated, adminController.getAllDamaged);
router.get("/all-employees", ensureAuthenticated, adminController.getAllEmployess);
router.get("/all-supplier", ensureAuthenticated, adminController.getAllSuppliers);
router.get("/all-stores", ensureAuthenticated, adminController.getAllStores);
router.get("/all-categories", ensureAuthenticated, adminController.getAllCategory);
router.get("/all-discounts", ensureAuthenticated, adminController.getAllDiscounts);
router.get("/all-products", ensureAuthenticated, adminController.getAllProducts);
router.get("/all-transactions", ensureAuthenticated, adminController.getAllTransactions);
router.get("/all-inventory", ensureAuthenticated, adminController.getAllInventory);


// edit Page
router.get("/edit-customers", ensureAuthenticated, (req, res) =>
res.render("customerEditForm", {
  pageTitle: "Welcome",
})
);


// form section

router.get("/create-customer", ensureAuthenticated, adminController.newCustomer);
router.get("/create-supplier", ensureAuthenticated, adminController.newSupplier);
router.get("/create-category", ensureAuthenticated, adminController.newCategory);
router.get("/create-position", ensureAuthenticated, adminController.newPosition);
router.get("/create-employee", ensureAuthenticated, adminController.newEmployee);
router.get("/create-discount", ensureAuthenticated, adminController.newDiscount);
router.get("/create-store", ensureAuthenticated, adminController.newStore);
router.get("/create-inventory", ensureAuthenticated, adminController.newInventory);


// form fotrr prices tag
router.get("/create-product/:id", ensureAuthenticated, adminController.newProduct);

router.get("/create-sales", ensureAuthenticated, adminController.counterForm);




router.post("/create-store", ensureAuthenticated, adminController.createNewStore);
router.post("/create-discount", ensureAuthenticated, adminController.createNewDiscount);
router.post("/create-inventory", ensureAuthenticated, adminController.createNewInventory);
router.post("/create-employee", ensureAuthenticated, adminController.createNewEmployee);
router.post("/create-category", ensureAuthenticated, adminController.createNewCategory);
router.post("/create-supplier", ensureAuthenticated, adminController.createNewSupplier);
router.post("/create-customer", ensureAuthenticated, adminController.createNewCustomer);
router.post("/create-position", ensureAuthenticated, adminController.createNewPosition);

//add price to null value










// // add to store
router.put('/product-status/unverified/:id',ensureAuthenticated,adminController.remove)

// add price for new store item
router.put("/create-sales/:id", ensureAuthenticated, adminController.createNewSales);
// router.put('/product-status/unverified/:id',adminController.addBig)

module.exports = router;
