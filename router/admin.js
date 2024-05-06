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

// form fotrr prices tag
router.get("/create-product/:id", ensureAuthenticated, adminController.newProduct);
// counter for attendants
router.get("/create-sales", ensureAuthenticated, adminController.counterForm);


// edit Page

// router.get("/edit-position/:id", ensureAuthenticated, (req, res) =>
// res.render("customerEditForm", {
//   pageTitle: "Welcome",
// })
// );


// form section

router.get("/create-customer", ensureAuthenticated, adminController.newCustomer);
router.get("/create-supplier", ensureAuthenticated, adminController.newSupplier);
router.get("/create-category", ensureAuthenticated, adminController.newCategory);
router.get("/create-position", ensureAuthenticated, adminController.newPosition);
router.get("/create-employee", ensureAuthenticated, adminController.newEmployee);
router.get("/create-discount", ensureAuthenticated, adminController.newDiscount);
router.get("/create-store", ensureAuthenticated, adminController.newStore);
router.get("/create-inventory", ensureAuthenticated, adminController.newInventory);


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
// add price for new store item to add to market
router.put("/create-sales/:id", ensureAuthenticated, adminController.createNewSales);


router.get("/edit-stores/:id", ensureAuthenticated, adminController.storeEdit);
router.get("/edit-discount/:id", ensureAuthenticated,adminController.editDiscount);
router.get("/edit-employee/:id", ensureAuthenticated, adminController.editEmployee);
router.get("/edit-supplier/:id", ensureAuthenticated, adminController.editSupplier)
router.get("/edit-category/:id", ensureAuthenticated, adminController.editCategory)
router.get("/edit-Inventory/:id", ensureAuthenticated, adminController.editInventory)


router.put("/edit-store/:id", ensureAuthenticated, adminController.editNewStore);
router.put("/edit-discount/:id", ensureAuthenticated, adminController.editNewDiscount);
router.put("/edit-employee/:id", ensureAuthenticated, adminController.editNewEmployee);
router.put("/edit-supplier/:id", ensureAuthenticated, adminController.editNewSupplier);
router.put("/edit-category/:id", ensureAuthenticated, adminController.editNewCategory);
router.put("/edit-inventory/:id", ensureAuthenticated, adminController.editNewInventory);
// router.put("/edit-customer/:id", ensureAuthenticated, adminController.editNewCustomer);
// router.put("/edit-position/:id", ensureAuthenticated, adminController.editNewPosition);



// delete

router.delete("/delete-store/:id", ensureAuthenticated, adminController.deleteStore);
router.delete("/delete-discount/:id", ensureAuthenticated, adminController.deleteDiscount);
router.delete("/delete-employee/:id", ensureAuthenticated, adminController.deleteEmployee);
router.delete("/delete-supplier/:id", ensureAuthenticated, adminController.deleteSupplier);
router.delete("/delete-category/:id", ensureAuthenticated, adminController.deleteCategory);
router.delete("/delete-inventory/:id", ensureAuthenticated, adminController.deleteInventory);
module.exports = router;
