const db = require("../model/databaseTable");
const stateData = require("../model/stateAndLGA");

const systemCalander = new Date().toLocaleDateString();
const yearModel = require("../model/getYear");
let presentYear = yearModel(systemCalander, "/");

const monthNameModel = require("../model/findCurrentMonth");
let monthName = monthNameModel(systemCalander, "/");

const dayModel = require("../model/dayOfWeek");
let dayName = dayModel(systemCalander, "/");

const monthModel = require("../model/getMonth");
let presentMonth = monthModel(systemCalander, "/");

const getDay = require("../model/getDay");
let presentDay = getDay(systemCalander, "/");

let sqlDate = presentYear + "-" + presentMonth + "-" + presentDay;

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

exports.getAdminWelcomePage = (req, res) => {
  const sessionEmail = req.session.employees.email;
  const sessionRole = req.session.employees.userRole;

  if (!sessionEmail) {
    req.flash("error_msg", "No session, you are required to log in");
    res.redirect("/");
    return;
  }
  if (sessionRole == "super") {

    db.query(`SELECT * FROM Suppliers `, (err, results) => {
      if (err) {
        console.log(err.sqlMessage);
        req.flash("error_msg", `${err.sqlMessage}`);
        res.redirect("/admin");
      }

      // check if item exist

      let data = JSON.stringify(results);
      let supplierData = JSON.parse(data);

      // render form

      db.query(`SELECT * FROM Positions `, (err, results) => {
        if (err) {
          req.flash("error_msg", `${err.sqlMessage}`);
          res.redirect("/admin");
        } else {
          let data = JSON.stringify(results);
          let allPositions = JSON.parse(data); 

          db.query(`SELECT * FROM Stores `, (err, results) => {
            if (err) {
              req.flash("error_msg", `${err.sqlMessage}`);
              res.redirect("/admin");
            } else {
              let data = JSON.stringify(results);
              let allStores = JSON.parse(data);

  // to get list of all employees
  db.query(
    `SELECT * FROM Employees WHERE userRole = "admin" `,
    (err, results) => {
      if (err) {
        console.log(err.sqlMessage);
        req.flash("error_msg", `${err.sqlMessage}`);
        res.redirect("/admin");
      }

      // check if item exist
      if (results.length <= 0) {
        console.log("employee is empty");
        req.flash(
          "error_msg",
          `Cannot create inventory when Admin list is empty`
        );
        res.redirect(`/admin/create-employee`);
        return;
      }

      let data = JSON.stringify(results);
      let employeeData = JSON.parse(data);

      // get list of all categories
      db.query(`SELECT * FROM Category `, (err, results) => {
        if (err) {
          console.log(err);
          req.flash("error_msg", `${err.sqlMessage}`);
          res.redirect("/admin");
          return;
        }
        // check if item exist
        if (results.length <= 0) {
          console.log("category is empty");
          req.flash(
            "error_msg",
            `Cannot create inventory when category is empty`
          );
          res.redirect(`/admin/create-category`);
          return;
        }

        // get the items to send to front end

        let data = JSON.stringify(results);
        let categoryData = JSON.parse(data);

        // hence add to form
   // total reg customers
          db.query(
            `SELECT * FROM Customers WHERE status = 'verified'`,
            (err, results) => {
              if (err) {
                req.flash("error_msg", ` ${err.sqlMessage}`);
                return res.redirect("/");
              } else {
                let totalVerifiedCustomers = results.length;
                res.render("adminSuper", {
                  pageTitle: "Welcome",
                  name: sessionEmail,
                  month: monthName,
                  day: dayName,
                  date: presentDay,
                  year: presentYear,
                  totalVerifiedCustomers,
                  stateData,
                  categoryData,
                  employeeData,
                  supplierData,
                  allPositions,
                  allStores,

                });
              }
            }
          );

        return;
      });
    }
  );

            }
          })
        }


      })
      
    
    });


  
  } else if (loggedRole == "admin") {
    return console.log(`${sessionRole} privilages under construction...`);
  } else {
    return console.log(`${sessionRole} privilages under construction...`);
    req.flash(
      "success_msg",
      `log in as ${sessionEmail + " Ready to make sales"}`
    );
    res.redirect("/user");
    return;
  }
};

// All employees table
exports.getAllEmployess = (req, res) => {
  const sessionEmail = req.session.employees.email;
  const sessionRole = req.session.employees.userRole;

  if (!sessionEmail) {
    req.flash("error_msg", "No session, you are required to log in");
    res.redirect("/");
    return;
  }
  if (sessionRole == "super") {
    // total reg customers
    db.query(`SELECT * FROM Employees `, (err, results) => {
      if (err) {
        req.flash("error_msg", ` ${err.sqlMessage}`);
        return res.redirect("/");
      } else {
        let data = JSON.stringify(results);
        let allEmployees = JSON.parse(data);

        allEmployees.forEach((employess) => {
          employess.created_date = formatDate(employess.created_date); // Assuming 'date' is the date field in your supplier table
        });

        res.render("employeeTable", {
          pageTitle: "All Employees",
          name: sessionEmail,
          month: monthName,
          day: dayName,
          date: presentDay,
          year: presentYear,
          allEmployees,
        });
      }
    });
  } else if (loggedRole == "admin") {
    return console.log(`${sessionRole} privilages under construction...`);
  } else {
    return console.log(`${sessionRole} privilages under construction...`);
    req.flash(
      "success_msg",
      `log in as ${sessionEmail + " Ready to make sales"}`
    );
    res.redirect("/user");
    return;
  }
};

// All sales table
exports.getAllSales = (req, res) => {
  const sessionEmail = req.session.employees.email;
  const sessionRole = req.session.employees.userRole;

  if (!sessionEmail) {
    req.flash("error_msg", "No session, you are required to log in");
    res.redirect("/");
    return;
  }
  if (sessionRole == "super") {
    // total reg customers
    db.query(`SELECT * FROM Sales `, (err, results) => {
      if (err) {
        req.flash("error_msg", ` ${err.sqlMessage}`);
        return res.redirect("/");
      } else {
        let data = JSON.stringify(results);
        let allSales = JSON.parse(data);

        allSales.forEach((date) => {
          date.created_date = formatDate(date.created_date); // Assuming 'date' is the date field in your supplier table
        });

        res.render("salesTable", {
          pageTitle: "Welcome",
          name: sessionEmail,
          month: monthName,
          day: dayName,
          date: presentDay,
          year: presentYear,
          allSales,
        });
      }
    });
  } else if (loggedRole == "admin") {
    return console.log(`${sessionRole} privilages under construction...`);
  } else {
    return console.log(`${sessionRole} privilages under construction...`);
    req.flash(
      "success_msg",
      `log in as ${sessionEmail + " Ready to make sales"}`
    );
    res.redirect("/user");
    return;
  }
};

// All Damaged table
exports.getAllDamaged = (req, res) => {
  const sessionEmail = req.session.employees.email;
  const sessionRole = req.session.employees.userRole;

  if (!sessionEmail) {
    req.flash("error_msg", "No session, you are required to log in");
    res.redirect("/");
    return;
  }
  if (sessionRole == "super") {
    // total reg customers
    db.query(`SELECT * FROM Damaged `, (err, results) => {
      if (err) {
        req.flash("error_msg", ` ${err.sqlMessage}`);
        return res.redirect("/");
      } else {
        let data = JSON.stringify(results);
        let allDamaged = JSON.parse(data);

        res.render("damageTable", {
          pageTitle: "Welcome",
          name: sessionEmail,
          month: monthName,
          day: dayName,
          date: presentDay,
          year: presentYear,
          allDamaged,
        });
      }
    });
  } else if (loggedRole == "admin") {
    return console.log(`${sessionRole} privilages under construction...`);
  } else {
    return console.log(`${sessionRole} privilages under construction...`);
    req.flash(
      "success_msg",
      `log in as ${sessionEmail + " Ready to make sales"}`
    );
    res.redirect("/user");
    return;
  }
};
// all customers tabble
exports.getAllCustomers = (req, res) => {
  const sessionEmail = req.session.employees.email;
  const sessionRole = req.session.employees.userRole;

  if (!sessionEmail) {
    req.flash("error_msg", "No session, you are required to log in");
    res.redirect("/");
    return;
  }
  if (sessionRole == "super") {
    // total reg customers
    db.query(`SELECT * FROM Customers `, (err, results) => {
      if (err) {
        req.flash("error_msg", ` ${err.sqlMessage}`);
        return res.redirect("/");
      } else {
        let data = JSON.stringify(results);
        let allCustomers = JSON.parse(data);
        allCustomers.forEach((customers) => {
          customers.created_date = formatDate(customers.created_date); // Assuming 'date' is the date field in your customers table
          customers.Previous_visit = formatDate(customers.Previous_visit); // Assuming 'date' is the date field in your Discount table
        });

        res.render("customersTable", {
          pageTitle: "Welcome",
          name: sessionEmail,
          month: monthName,
          day: dayName,
          date: presentDay,
          year: presentYear,
          allCustomers,
        });
      }
    });
  } else if (loggedRole == "admin") {
    return console.log(`${sessionRole} privilages under construction...`);
  } else {
    return console.log(`${sessionRole} privilages under construction...`);
    req.flash(
      "success_msg",
      `log in as ${sessionEmail + " Ready to make sales"}`
    );
    res.redirect("/user");
    return;
  }
};

// all customers tabble
exports.getAllSuppliers = (req, res) => {
  const sessionEmail = req.session.employees.email;
  const sessionRole = req.session.employees.userRole;

  if (!sessionEmail) {
    req.flash("error_msg", "No session, you are required to log in");
    res.redirect("/");
    return;
  }
  if (sessionRole == "super") {
    // total reg customers
    db.query(`SELECT * FROM Suppliers `, (err, results) => {
      if (err) {
        req.flash("error_msg", ` ${err.sqlMessage}`);
        return res.redirect("/");
      } else {
        let data = JSON.stringify(results);
        let allSuppliers = JSON.parse(data);

        allSuppliers.forEach((supplier) => {
          supplier.created_date = formatDate(supplier.created_date); // Assuming 'date' is the date field in your supplier table
        });
        res.render("supplierTable", {
          pageTitle: "All suppliers",
          name: sessionEmail,
          month: monthName,
          day: dayName,
          date: presentDay,
          year: presentYear,
          allSuppliers,
        });
      }
    });
  } else if (loggedRole == "admin") {
    return console.log(`${sessionRole} privilages under construction...`);
  } else {
    return console.log(`${sessionRole} privilages under construction...`);
    req.flash(
      "success_msg",
      `log in as ${sessionEmail + " Ready to make sales"}`
    );
    res.redirect("/user");
    return;
  }
};

// all stores tabble
exports.getAllStores = (req, res) => {
  const sessionEmail = req.session.employees.email;
  const sessionRole = req.session.employees.userRole;

  if (!sessionEmail) {
    req.flash("error_msg", "No session, you are required to log in");
    res.redirect("/");
    return;
  }
  if (sessionRole == "super") {
    // total reg customers
    db.query(`SELECT * FROM Stores `, (err, results) => {
      if (err) {
        req.flash("error_msg", ` ${err.sqlMessage}`);
        return res.redirect("/");
      } else {
        let data = JSON.stringify(results);
        let allStores = JSON.parse(data);

        res.render("storesTable", {
          pageTitle: "Welcome",
          name: sessionEmail,
          month: monthName,
          day: dayName,
          date: presentDay,
          year: presentYear,
          allStores,
        });
      }
    });
  } else if (loggedRole == "admin") {
    return console.log(`${sessionRole} privilages under construction...`);
  } else {
    return console.log(`${sessionRole} privilages under construction...`);
    req.flash(
      "success_msg",
      `log in as ${sessionEmail + " Ready to make sales"}`
    );
    res.redirect("/user");
    return;
  }
};

// all stores tabble
exports.getAllDiscounts = (req, res) => {
  const sessionEmail = req.session.employees.email;
  const sessionRole = req.session.employees.userRole;

  if (!sessionEmail) {
    req.flash("error_msg", "No session, you are required to log in");
    res.redirect("/");
    return;
  }
  if (sessionRole == "super") {
    // total reg customers
    db.query(`SELECT * FROM Discount `, (err, results) => {
      if (err) {
        req.flash("error_msg", ` ${err.sqlMessage}`);
        return res.redirect("/");
      } else {
        let data = JSON.stringify(results);
        let allDiscounts = JSON.parse(data);

        // Format dates in allDiscounts
        allDiscounts.forEach((discount) => {
          discount.Start_date = formatDate(discount.Start_date); // Assuming 'date' is the date field in your Discount table
          discount.End_date = formatDate(discount.End_date); // Assuming 'date' is the date field in your Discount table
        });

        res.render("discountTable", {
          pageTitle: "Welcome",
          name: sessionEmail,
          month: monthName,
          day: dayName,
          date: presentDay,
          year: presentYear,
          allDiscounts,
        });
      }
    });
  } else if (loggedRole == "admin") {
    return console.log(`${sessionRole} privilages under construction...`);
  } else {
    return console.log(`${sessionRole} privilages under construction...`);
    req.flash(
      "success_msg",
      `log in as ${sessionEmail + " Ready to make sales"}`
    );
    res.redirect("/user");
    return;
  }
};
// all cats
exports.getAllCategory = (req, res) => {
  const sessionEmail = req.session.employees.email;
  const sessionRole = req.session.employees.userRole;

  if (!sessionEmail) {
    req.flash("error_msg", "No session, you are required to log in");
    res.redirect("/");
    return;
  }
  if (sessionRole == "super") {
    // total reg customers
    db.query(`SELECT * FROM Category `, (err, results) => {
      if (err) {
        req.flash("error_msg", ` ${err.sqlMessage}`);
        return res.redirect("/");
      } else {
        let data = JSON.stringify(results);
        let allCategory = JSON.parse(data);

        res.render("categoryTable", {
          pageTitle: "Welcome",
          name: sessionEmail,
          month: monthName,
          day: dayName,
          date: presentDay,
          year: presentYear,
          allCategory,
        });
      }
    });
  } else if (loggedRole == "admin") {
    return console.log(`${sessionRole} privilages under construction...`);
  } else {
    return console.log(`${sessionRole} privilages under construction...`);
    req.flash(
      "success_msg",
      `log in as ${sessionEmail + " Ready to make sales"}`
    );
    res.redirect("/user");
    return;
  }
};

// all Products
exports.getAllProducts = (req, res) => {
  const sessionEmail = req.session.employees.email;
  const sessionRole = req.session.employees.userRole;

  if (!sessionEmail) {
    req.flash("error_msg", "No session, you are required to log in");
    res.redirect("/");
    return;
  }
  if (sessionRole == "super") {
    // total reg customers
    db.query(`SELECT * FROM Products  `, (err, results) => {
      if (err) {
        req.flash("error_msg", ` ${err.sqlMessage}`);
        return res.redirect("/");
      } else {
        let data = JSON.stringify(results);
        let allProducts = JSON.parse(data);

        res.render("productsTable", {
          pageTitle: "All products",
          name: sessionEmail,
          month: monthName,
          day: dayName,
          date: presentDay,
          year: presentYear,
          allProducts,
        });
      }
    });
  } else if (loggedRole == "admin") {
    return console.log(`${sessionRole} privilages under construction...`);
  } else {
    return console.log(`${sessionRole} privilages under construction...`);
    req.flash(
      "success_msg",
      `log in as ${sessionEmail + " Ready to make sales"}`
    );
    res.redirect("/user");
    return;
  }
};
// all transac
exports.getAllTransactions = (req, res) => {
  const sessionEmail = req.session.employees.email;
  const sessionRole = req.session.employees.userRole;

  if (!sessionEmail) {
    req.flash("error_msg", "No session, you are required to log in");
    res.redirect("/");
    return;
  }
  if (sessionRole == "super") {
    // total reg customers
    db.query(`SELECT * FROM Transactions `, (err, results) => {
      if (err) {
        req.flash("error_msg", ` ${err.sqlMessage}`);
        return res.redirect("/");
      } else {
        let data = JSON.stringify(results);
        let allTransactions = JSON.parse(data);

        allTransactions.forEach((sales) => {
          sales.TransactionDate = formatDate(sales.TransactionDate); // Assuming 'date' is the date field in your supplier table
        });

        res.render("transactionTable", {
          pageTitle: "All Transactions",
          name: sessionEmail,
          month: monthName,
          day: dayName,
          date: presentDay,
          year: presentYear,
          allTransactions,
        });
      }
    });
  } else if (loggedRole == "admin") {
    return console.log(`${sessionRole} privilages under construction...`);
  } else {
    return console.log(`${sessionRole} privilages under construction...`);
    req.flash(
      "success_msg",
      `log in as ${sessionEmail + " Ready to make sales"}`
    );
    res.redirect("/user");
    return;
  }
};

// all Inventory
exports.getAllInventory = (req, res) => {
  const sessionEmail = req.session.employees.email;
  const sessionRole = req.session.employees.userRole;

  if (!sessionEmail) {
    req.flash("error_msg", "No session, you are required to log in");
    res.redirect("/");
    return;
  }
  if (sessionRole == "super") {
    // to get invent table
    db.query(`SELECT * FROM inventory `, (err, results) => {
      if (err) {
        req.flash("error_msg", ` ${err.sqlMessage}`);
        return res.redirect("/admin");
      } else {
        let data = JSON.stringify(results);
        let allInventory = JSON.parse(data);

        // to reformat the date
        allInventory.forEach((inventory) => {
          inventory.created_date = formatDate(inventory.created_date); // Assuming 'date' is the date field in your supplier table
          inventory.Manufacture_date = formatDate(inventory.Manufacture_date); // Assuming 'date' is the date field in your supplier table
          inventory.Expire_date = formatDate(inventory.Expire_date); // Assuming 'date' is the date field in your supplier table
        });

        return res.render("inventoryTable", {
          pageTitle: "All Inventory",
          name: sessionEmail,
          month: monthName,
          day: dayName,
          date: presentDay,
          year: presentYear,
          allInventory,
        });
      }
    });
  } else if (loggedRole == "admin") {
    return console.log(`${sessionRole} privilages under construction...`);
  } else {
    return console.log(`${sessionRole} privilages under construction...`);
    req.flash(
      "success_msg",
      `log in as ${sessionEmail + " Ready to make sales"}`
    );
    res.redirect("/user");
    return;
  }
};

// all Positions
exports.getAllPositions = (req, res) => {
  const sessionEmail = req.session.employees.email;
  const sessionRole = req.session.employees.userRole;

  if (!sessionEmail) {
    req.flash("error_msg", "No session, you are required to log in");
    res.redirect("/");
    return;
  }
  if (sessionRole == "super") {
    // to get invent table
    db.query(`SELECT * FROM Positions `, (err, results) => {
      if (err) {
        req.flash("error_msg", ` ${err.sqlMessage}`);
        return res.redirect("/admin");
      } else {
        let data = JSON.stringify(results);
        let allPosition = JSON.parse(data);

        return res.render("positionTable", {
          pageTitle: "All Inventory",
          name: sessionEmail,
          month: monthName,
          day: dayName,
          date: presentDay,
          year: presentYear,
          allPosition,
        });
      }
    });
  } else if (loggedRole == "admin") {
    return console.log(`${sessionRole} privilages under construction...`);
  } else {
    return console.log(`${sessionRole} privilages under construction...`);
    req.flash(
      "success_msg",
      `log in as ${sessionEmail + " Ready to make sales"}`
    );
    res.redirect("/user");
    return;
  }
};



// single item
exports.getInventoryById = (req, res) => {

  let singleId = req.params.id
  
  const sessionEmail = req.session.employees.email;
  const sessionRole = req.session.employees.userRole;

  if (!sessionEmail) {
    req.flash("error_msg", "No session, you are required to log in");
    res.redirect("/");
    return;
  }
  if (sessionRole == "super") {
    // to get invent table
    db.query(`SELECT * FROM inventory WHERE id = "${singleId}" `, (err, results) => {
      if (err) {
        req.flash("error_msg", ` ${err.sqlMessage}`);
        return res.redirect("/admin");
      } else {
        let data = JSON.stringify(results);
        let allInventory = JSON.parse(data);

        // to reformat the date
        allInventory.forEach((inventory) => {
          inventory.created_date = formatDate(inventory.created_date); // Assuming 'date' is the date field in your supplier table
          inventory.Manufacture_date = formatDate(inventory.Manufacture_date); // Assuming 'date' is the date field in your supplier table
          inventory.Expire_date = formatDate(inventory.Expire_date); // Assuming 'date' is the date field in your supplier table
        });

        return res.render("inventorySingle", {
          pageTitle: `${allInventory[0].Product_name} | ${allInventory[0].Brand_name}`,
          name: sessionEmail,
          month: monthName,
          day: dayName,
          date: presentDay,
          year: presentYear,
          allInventory,
        });
      }
    });
  } else if (loggedRole == "admin") {
    return console.log(`${sessionRole} privilages under construction...`);
  } else {
    return console.log(`${sessionRole} privilages under construction...`);
    req.flash(
      "success_msg",
      `log in as ${sessionEmail + " Ready to make sales"}`
    );
    res.redirect("/user");
    return;
  }
};


// customers
exports.newCustomer = (req, res) => {
  const sessionEmail = req.session.employees.email;
  const sessionRole = req.session.employees.userRole;

  if (!sessionEmail) {
    req.flash("error_msg", "No session, you are required to log in");
    res.redirect("/");
    return;
  }

  if (sessionRole == "super") {
    res.render("customerForm", {
      pageTitle: "Create new customers",
      name: sessionEmail,
      month: monthName,
      day: dayName,
      date: presentDay,
      year: presentYear,
    });
  } else {
  }
};






//  product to e sold
exports.newProduct = (req, res) => {
  const id = req.params.id;

  const sessionEmail = req.session.employees.email;
  const sessionRole = req.session.employees.userRole;

  if (!sessionEmail) {
    req.flash("error_msg", "No session, you are required to log in");
    res.redirect("/");
    return;
  } else {
    // check if "super"

    // retreive the data from inventroy table
    db.query(`SELECT * FROM inventory WHERE id = "${id}" `, (err, results) => {
      if (err) {
        req.flash("error_msg", `${err.sqlMessage}`);
        res.redirect("/admin");
      } else {
        let data = JSON.stringify(results);
        let inventoryDataFromDb = JSON.parse(data);

        // check if its in pro db
        db.query(
          `SELECT * FROM Products WHERE inventory_id = "${id}" `,
          (err, results) => {
            if (err) {
              console.log(err);
              req.flash("error_msg", `${err.sqlMessage}`);
              res.redirect("/admin");
            }

            if (results.length <= 0) {
              // no record found with such id in products

              // object to be inserted
              let prodcutDataToAdd = {
                Brand_name: inventoryDataFromDb[0].Brand_name,
                ProductName: inventoryDataFromDb[0].Product_name,
                category: inventoryDataFromDb[0].Category_name,
                inventory_id: inventoryDataFromDb[0].id,
                UnitPrice: null,
                StockQuantity: inventoryDataFromDb[0].QTY_recieved,
                created_date: sqlDate,
                activate: inventoryDataFromDb[0].activate,
              };

              // adding to products table
              db.query(
                "INSERT INTO Products SET ?",
                prodcutDataToAdd,
                (err, results) => {
                  if (err) {
                    console.log(err.sqlMessage);
                    req.flash("error_msg", `${err.sqlMessage}`);
                    return res.redirect("/admin");
                  }

                  //  redirct to add price tag

                  res.render("productForm", {
                    msg: "enter price to send item to shop",
                    pageTitle: "Create new Price",
                    name: sessionEmail,
                    month: monthName,
                    day: dayName,
                    date: presentDay,
                    year: presentYear,
                    stateData,
                    inventoryDataFromDb,
                  });
                }
              );
            } else {
              // record found, no need to add just render price form
              res.render("productForm", {
                pageTitle: "Create new Price",
                name: sessionEmail,
                month: monthName,
                day: dayName,
                date: presentDay,
                year: presentYear,
                stateData,
                inventoryDataFromDb,
              });
            }
          }
        );
      }
    });
  }
};

//  at the counter page
exports.counterForm = (req, res) => {
  const sessionEmail = req.session.employees.email;
  const sessionRole = req.session.employees.userRole;

  if (!sessionEmail) {
    req.flash("error_msg", "No session, you are required to log in");
    res.redirect("/");
    return;
  }

  db.query(`SELECT * FROM Category `, (err, results) => {
    if (err) {
      req.flash("error_msg", ` ${err.sqlMessage}`);
      return res.redirect("/");
    } else {
      let data = JSON.stringify(results);
      let allCategory = JSON.parse(data);
      if (sessionRole == "super") {
        res.render("userdash", {
          pageTitle: "At the counter",
          name: sessionEmail,
          month: monthName,
          day: dayName,
          date: presentDay,
          year: presentYear,
          allCategory,
        });
      } else {
        res.render("userdash", {
          pageTitle: "At the counter",
          name: sessionEmail,
          month: monthName,
          day: dayName,
          date: presentDay,
          year: presentYear,
          allCategory,
        });
      }
    }
  });
};

// post req

exports.createNewEmployee = (req, res) => {
  const {
    First_name,
    Last_name,
    email,
    Contact_phone,
    Gender,
    State,
    lga,
    Position,
    Store,
    role,
    Password,
  } = req.body;

  if (
    !(
      First_name &&
      Last_name &&
      email &&
      Contact_phone &&
      Gender &&
      State &&
      lga &&
      Position &&
      Store &&
      Password
    )
  ) {
    req.flash("error_msg", `Enter all field before submiting`);
    return res.redirect("/admin/create-employee");
  }

  db.query(
    "SELECT * FROM Employees WHERE First_name = ?",
    [First_name],
    (error, results) => {
      if (error) {
        req.flash(
          "error_msg",
          `Error from server Database: ${error.sqlMessage}`
        );
        return res.redirect("/admin");
      }

      if (results.length <= 0) {
        // do this
        db.query("INSERT INTO Employees SET ?", {
          First_name: First_name,
          Last_name: Last_name,
          email: email,
          Contact_phone: Contact_phone,
          Position: Position,
          Gender: Gender,
          Store: Store,
          State: State,
          lga: lga,
          userRole: role,
          Password: Password,
          created_date: sqlDate,
        });

        req.flash("success_msg", `"${First_name}" added successfully!`);
        return res.redirect("/admin/create-employee");
      }
      req.flash("error_msg", `"${First_name}" alrready exist!`);
      return res.redirect("/admin/create-employee");
    }
  );
};

exports.createNewCategory = (req, res) => {

  const { Category_name, Desc } = req.body;
  
  if (!(Category_name && Desc)) {
    req.flash("error_msg", `Enter all field before submiting new category`);
    return res.redirect("/admin/");
  }
  
  db.query(
    "SELECT * FROM Category WHERE Category_name = ?",
    [Category_name],
    (error, results) => {
      if (error) {
        req.flash(
          "error_msg",
          `Error from server Database: ${error.sqlMessage}`
        );
        return res.redirect("/admin");
      }

      if (results.length <= 0) {
        // do this
        db.query("INSERT INTO Category SET ?", {
          Category_name: Category_name,
          details: Desc,
        });

        req.flash("success_msg", `"${Category_name}" added successfully!`);
        return res.redirect("/admin");
      }
      req.flash("error_msg", `"${Category_name}" alrready exist!`);
      return res.redirect("/admin");
    }
  );
};

exports.createNewSupplier = (req, res) => {
  console.log(req.body);
  const { First_name, Last_name, email, Phone, Address, Business_name } =
    req.body;

  if (!(First_name && Last_name && email && Phone && Address, Business_name)) {
    req.flash("error_msg", `Enter all field before submiting`);
    return res.redirect("/admin/create-supplier");
  }

  db.query(
    "SELECT * FROM Suppliers WHERE Business_name = ?",
    [Business_name],
    (error, results) => {
      if (error) {
        req.flash(
          "error_msg",
          `Error from server Database: ${error.sqlMessage}`
        );
        return res.redirect("/admin/create-supplier");
      }

      if (results.length <= 0) {
        // do this
        db.query("INSERT INTO Suppliers SET ?", {
          First_name: First_name,
          Last_name: Last_name,
          Business_name: Business_name,
          email: email,
          Phone: Phone,
          Address: Address,
          created_date: sqlDate,
        });

        req.flash("success_msg", `"${Business_name}" added successfully!`);
        return res.redirect("/admin/create-supplier");
      }
      req.flash("error_msg", `"${Business_name}" alrready exist!`);
      return res.redirect("/admin/create-supplier");
    }
  );
};

exports.createNewStore = (req, res) => {

  const { Branch_Name, Branch_state, Branch_lga, Branch_address } = req.body;

  if (!(Branch_Name && Branch_state && Branch_lga && Branch_address)) {
    req.flash("error_msg", `Enter all field before submiting Store`);
    return res.redirect("/admin/");
  }

  db.query(
    "SELECT * FROM Stores WHERE store_name = ?",
    [Branch_Name],
    (error, results) => {
      if (error) {
        req.flash(
          "error_msg",
          `Error from server Database: ${error.sqlMessage}`
        );
        return res.redirect("/admin");
      }

      // none found with the name??
      if (results.length <= 0) {
        // do this
        db.query("INSERT INTO Stores SET ?", {
          store_name: Branch_Name,
          store_address: Branch_address,
          state: Branch_state,
          lga: Branch_lga,
        });

        req.flash("success_msg", `"${Branch_Name}" added successfully!`);
        return res.redirect("/admin/");
      }
      req.flash("error_msg", `"${Branch_Name}" alrready exist!`);
      return res.redirect("/admin/");
    }
  );
};

exports.createNewDiscount = (req, res) => {
  const {
    Discount_name,
    Discount_Provider,
    Discount_Percentage,
    Start_Date,
    End_Date,
  } = req.body;

  if (
    !(
      Discount_name &&
      Discount_Provider &&
      Discount_Percentage &&
      Start_Date &&
      End_Date
    )
  ) {
    req.flash("error_msg", `Enter all field before submiting`);
    return res.redirect("/admin/create-discount");
  }

  db.query(
    "SELECT * FROM Discount WHERE Discount_name = ?",
    [Discount_name],
    (error, results) => {
      if (error) {
        req.flash(
          "error_msg",
          `Error from server Database: ${error.sqlMessage}`
        );
        return res.redirect("/admin");
      }

      if (results.length <= 0) {
        // do this
        db.query("INSERT INTO Discount SET ?", {
          Discount_name: Discount_name,
          Discount_Provider: Discount_Provider,
          Discount_percentage: Discount_Percentage,
          Start_Date: Start_Date,
          End_Date: End_Date,
        });

        req.flash("success_msg", `"${Discount_name}" added successfully!`);
        return res.redirect("/admin/all-discounts");
      }
      req.flash("error_msg", `"${Discount_name}" alrready exist!`);
      return res.redirect("/admin/all-discounts");
    }
  );
};

exports.createNewInventory = (req, res) => {
  /*
     list of categories
     list of suppliers
     list of employee  in a certain store
    */

  // req body
  const {
    Category_name,
    Brand_name,
    Product_name,
    Purchase_price,
    Supplier_name,
    Payment_method,
    Reciever_name,
    Delivery_method,
    QTY_recieved,
    total_in_pack,
    Manufacture_date,
    Expire_date,
    Cost_of_delivery,
    Total_damaged,
  } = req.body;
  // ensure all fields
  if (
    !(
      Category_name &&
      Brand_name &&
      Product_name &&
      Purchase_price &&
      Supplier_name &&
      Payment_method &&
      Reciever_name &&
      Delivery_method &&
      QTY_recieved &&
      total_in_pack &&
      Manufacture_date &&
      Expire_date &&
      Cost_of_delivery &&
      Total_damaged
    )
  ) {
    req.flash("error_msg", `Enter all field before submiting`);
    return res.redirect("/admin/create-inventory");
  }

  // create the inventory
  db.query(
    "INSERT INTO inventory SET ?",
    {
      Category_name: Category_name,
      Brand_name: Brand_name,
      Product_name: Product_name,
      Purchase_price: Purchase_price,
      Supplier_name: Supplier_name,
      Payment_method: Payment_method,
      Reciever_name: Reciever_name,
      Delivery_method: Delivery_method,
      QTY_recieved: QTY_recieved,
      total_in_pack: total_in_pack,
      Manufacture_date: Manufacture_date,
      Expire_date: Expire_date,
      Cost_of_delivery: Cost_of_delivery,
      Total_damaged: Total_damaged,
      created_date: sqlDate,
      activate: "no",
    },
    (err, results) => {
      if (err) {
        req.flash("error_msg", `Error from server Database: ${err.sqlMessage}`);
        return res.redirect("/admin/create-inventory");
      } else {
        req.flash("success_msg", `"${Product_name}" added successfully!`);
        return res.redirect("/admin/create-inventory");
      }
    }
  );
};

exports.createNewCustomer = (req, res) => {
  console.log(req.body);
  const { First_name, Last_name, email, Phone, Address } = req.body;

  if (!(First_name && Last_name && email && Phone && Address)) {
    req.flash("error_msg", `Enter all field before submiting`);
    return res.redirect("/admin/create-customer");
  }

  db.query(
    "SELECT * FROM Customers WHERE First_name = ? AND Last_name = ? ",
    [First_name, Last_name],
    (error, results) => {
      if (error) {
        req.flash(
          "error_msg",
          `Error from server Database: ${error.sqlMessage}`
        );
        return res.redirect("/admin/create-customer");
      }

      if (results.length <= 0) {
        // do this
        db.query("INSERT INTO Customers SET ?", {
          First_name: First_name,
          Last_name: Last_name,
          email: email,
          Phone: Phone,
          Address: Address,
          created_date: sqlDate,
          Previous_visit: sqlDate,
          spending: 0,
        });

        req.flash("success_msg", `"${First_name}" added successfully!`);
        return res.redirect("/admin/create-customer");
      }
      req.flash("error_msg", `"${First_name}" alrready exist!`);
      return res.redirect("/admin/create-customer");
    }
  );
};

exports.createNewPosition = (req, res) => {
  const { Position_name, Salary, Job_description } = req.body;

  if (!(Position_name && Salary && Job_description)) {
    req.flash("error_msg", `Enter all field before submiting`);
    return res.redirect("/admin/create-position");
  }

  db.query(
    "SELECT * FROM Positions WHERE Position_name = ?",
    [Position_name],
    (error, results) => {
      if (error) {
        req.flash(
          "error_msg",
          `Error from server Database: ${error.sqlMessage}`
        );
        return res.redirect("/admin/create-position");
      }

      if (results.length <= 0) {
        // do this
        db.query("INSERT INTO Positions SET ?", {
          Position_name: Position_name,
          Salary: Salary,
          Job_description: Job_description,
        });

        req.flash("success_msg", `"${Position_name}" added successfully!`);
        return res.redirect("/admin/create-position");
      }
      req.flash("error_msg", `"${Position_name}" alrready exist!`);
      return res.redirect("/admin/create-position");
    }
  );
};

// price form
exports.createNewSales = (req, res) => {
  const updateID = req.params.id;
  const { price } = req.body;

  // if user is admin
  if (!price) {
    req.flash("error_msg", `Enter Price before submiting`);
    return res.redirect("/admin");
  }
  // check if item exist before in product
  db.query(
    "SELECT * FROM Products WHERE inventory_id = ?",
    [updateID],
    (error, results) => {
      if (error) {
        req.flash(
          "error_msg",
          `Error from server Database: ${error.sqlMessage}`
        );
        return res.redirect("/admin/create");
      }

      if (results.length <= 0) {
        req.flash("error_msg", `price already added`);
        res.redirect(`/admin/all-inventory`);
        return;
      }

      // item does has no price
      db.query(
        `UPDATE Products SET ? WHERE inventory_id = "${updateID}"`,
        { UnitPrice: price, activate: "yes" },
        (err, results) => {
          if (err) {
            console.log(err);
            req.flash(
              "error_msg",
              `Error from server Database: ${err.sqlMessage}`
            );
            return res.redirect("/admin");
          }
          // further proceed to inventory
          db.query(
            `UPDATE inventory SET ? WHERE id = "${updateID}"`,
            { activate: "yes" },
            (err, results) => {
              if (err) {
                console.log(err);
                req.flash(
                  "error_msg",
                  `Error from server Database: ${err.sqlMessage}`
                );
                return res.redirect("/admin");
              }

              req.flash(
                "success_msg",
                `price added, now available to be sold in store`
              );
              return res.redirect("/admin/all-products");
            }
          );
        }
      );

      // price add
      return;
    }
  );
};

// activate

exports.remove = (req, res) => {
  let pageId = req.params.id;

  db.query(`SELECT * FROM inventory WHERE id = "${pageId}"`, (err, results) => {
    if (err) {
      req.flash("error_msg", `sorry ${err.sqlMessage}`);
      return res.redirect("/");
    }

    db.query(
      `UPDATE inventory SET ? WHERE id = "${pageId}"`,
      { status: "verified" },
      (err, results) => {
        if (err) {
          req.flash(
            "error_msg",
            `an error occurred from database, ${err.sqlMessage}`
          );
        }
        req.flash("success_msg", `Status is verified`);
        res.redirect("/admin/all-inventory");
        return;
      }
    );
  });
};







// edit section





// form
exports.storeEdit = (req, res) => {
  let editID = req.params.id;
  const sessionEmail = req.session.employees.email;
  const sessionRole = req.session.employees.userRole;

  if (!sessionEmail) {
    req.flash("error_msg", "No session, you are required to log in");
    res.redirect("/");
    return;
  }
  db.query(`SELECT * FROM Stores WHERE id = ${editID}`, (err, results) => {
    if (err) {
      req.flash("error_msg", `${err.sqlMessage}`);
      return res.redirect("/admin");
    } else {
      if (results.length <= 0) {
        req.flash("error_msg", `no item  found`);
        return res.redirect("/admin");
      }

      let data = JSON.stringify(results);
      let storeData = JSON.parse(data);
      console.log(storeData);

      return res.render("storesEditForm", {
        pageTitle: "Welcome",
        name: sessionEmail,
        month: monthName,
        day: dayName,
        date: presentDay,
        year: presentYear,
        storeData,
        stateData,
      });
    }
  });
};
exports.editDiscount = (req, res) => {
  let editID = req.params.id;
  const sessionEmail = req.session.employees.email;
  const sessionRole = req.session.employees.userRole;

  if (!sessionEmail) {
    req.flash("error_msg", "No session, you are required to log in");
    res.redirect("/");
    return;
  }
  db.query(`SELECT * FROM Discount WHERE id = ${editID}`, (err, results) => {
    if (err) {
      req.flash("error_msg", `${err.sqlMessage}`);
      return res.redirect("/admin");
    } else {
      if (results.length <= 0) {
        req.flash("error_msg", `no item  found`);
        return res.redirect("/admin");
      }

      let data = JSON.stringify(results);
      let discountData = JSON.parse(data);
      console.log(discountData);

      return res.render("discountEditForm", {
        pageTitle: "Discount",
        name: sessionEmail,
        month: monthName,
        day: dayName,
        date: presentDay,
        year: presentYear,
        discountData,
      });
    }
  });
};

exports.editEmployee = (req, res) => {
  let editID = req.params.id;
  const sessionEmail = req.session.employees.email;
  const sessionRole = req.session.employees.userRole;

  if (!sessionEmail) {
    req.flash("error_msg", "No session, you are required to log in");
    res.redirect("/");
    return;
  }

  db.query(`SELECT * FROM Stores `, (err, results) => {
    if (err) {
      req.flash("error_msg", `${err.sqlMessage}`);
      return res.redirect("/admin");
    } else {
      let data = JSON.stringify(results);
      let allStores = JSON.parse(data);

      db.query(`SELECT * FROM Positions `, (err, results) => {
        if (err) {
          req.flash("error_msg", `${err.sqlMessage}`);
          return res.redirect("/admin");
        } else {
          let data = JSON.stringify(results);
          let allPositions = JSON.parse(data);

          db.query(
            `SELECT * FROM Employees WHERE id = ${editID}`,
            (err, results) => {
              if (err) {
                req.flash("error_msg", `${err.sqlMessage}`);
                return res.redirect("/admin");
              } else {
                if (results.length <= 0) {
                  req.flash("error_msg", `no item  found`);
                  return res.redirect("/admin");
                }

                let data = JSON.stringify(results);
                let employeeData = JSON.parse(data);

                res.render("employeeEditForm", {
                  pageTitle: "Edit Employee",
                  name: sessionEmail,
                  month: monthName,
                  day: dayName,
                  date: presentDay,
                  year: presentYear,
                  stateData,
                  employeeData,
                  allPositions,
                  allStores,
                });
              }
            }
          );
        }
      });
    }
  });
};

exports.editSupplier = (req, res) => {
  let editID = req.params.id;
  const sessionEmail = req.session.employees.email;
  const sessionRole = req.session.employees.userRole;

  if (!sessionEmail) {
    req.flash("error_msg", "No session, you are required to log in");
    res.redirect("/");
    return;
  }

  if (sessionRole == "super") {
    db.query(`SELECT * FROM Suppliers WHERE id = ${editID}`, (err, results) => {
      if (err) {
        req.flash("error_msg", `${err.sqlMessage}`);
        res.redirect("/admin");
      } else {
        if (results.length <= 0) {
          req.flash("error_msg", `no item  found`);
          return res.redirect("/admin");
        }

        let data = JSON.stringify(results);
        let supplierData = JSON.parse(data);

        return res.render("supplierEditForm", {
          pageTitle: "Edit Supplier",
          name: sessionEmail,
          month: monthName,
          day: dayName,
          date: presentDay,
          year: presentYear,
          supplierData,
        });
      }
    });
  } else {
    console.log("can not access this feature");
  }
};

exports.editCategory = (req, res) => {
    let editID = req.params.id
    const sessionEmail = req.session.employees.email;
    const sessionRole = req.session.employees.userRole;
  
    if (!sessionEmail) {
      req.flash("error_msg", "No session, you are required to log in");
      res.redirect("/");
      return;
    }
  
    if (sessionRole == "super") {

        db.query(`SELECT * FROM Category WHERE CategoryID = "${editID}"`, (err, results) => {
            if (err) {
                req.flash("error_msg",`${err.sqlMessage}`)
                return res.redirect('/admin/all-categories')
            }

            let data = JSON.stringify(results);
            let categoryData = JSON.parse(data);
            
         return   res.render("categoryEditForm", {
                pageTitle: "edit Cat",
                name: sessionEmail,
                month: monthName,
                day: dayName,
                date: presentDay,
                year: presentYear,
                categoryData
              });
        })} else {
            req.flash('error_msg', `you can not view that resource`)
            res.redirect('/')
    }
  };

  exports.editInventory = (req, res) => {
    let editID = req.params.id
    const sessionEmail = req.session.employees.email;
    const sessionRole = req.session.employees.userRole;
  
    if (!sessionEmail) {
      req.flash("error_msg", "No session, you are required to log in");
      res.redirect("/");
      return;
    }
  
    if (sessionRole == "super") {

        db.query(`SELECT * FROM Suppliers `, (err, results) => {
            if (err) {
                req.flash('error_msg', `${err.sqlMessage}`)
                return  res.redirect('/admin/all-inventory')
            }

            let data = JSON.stringify(results);
            let supplierData = JSON.parse(data);

             db.query(`SELECT * FROM Employees WHERE Position = "manager" `, (err, results)=> {
                if (err) {
                    req.flash('error_msg', `${err.sqlMessage}`)
                    return  res.redirect('/admin/all-inventory')
                }

                let data = JSON.stringify(results);
                let employeeData = JSON.parse(data);
                // cats
                  db.query(`SELECT * FROM Category `, (err, results) => {
                    if (err) {
                        req.flash('error_msg', `${err.sqlMessage}`)
                        return  res.redirect('/admin/all-inventory')
                    }

                    let data = JSON.stringify(results);
                    let categoryData = JSON.parse(data);
  
                    db.query(`SELECT * FROM inventory WHERE id = "${editID}"`, (err, results) => {
                      if (err) {
                          req.flash("error_msg",`${err.sqlMessage}`)
                          return res.redirect('/admin/all-inventory')
                      }
          
                      let data = JSON.stringify(results);
                      let inventoryData = JSON.parse(data);
                      
                         res.render("inventoryEditForm", {
                          pageTitle: "edit inventory",
                          name: sessionEmail,
                          month: monthName,
                          day: dayName,
                          date: presentDay,
                          year: presentYear,
                          inventoryData,
                          categoryData,
                          employeeData,
                          supplierData
                    });
                  }) // inventory
                  }) // category
           
              }) // employee
        }) // supplier
    
    } else {
            req.flash('error_msg', `you can not view that resource`)
            res.redirect('/')
    }
  };

  exports.editPosition = (req, res) => {
    let editID = req.params.id;
    const sessionEmail = req.session.employees.email;
    const sessionRole = req.session.employees.userRole;
  
    if (!sessionEmail) {
      req.flash("error_msg", "No session, you are required to log in");
      res.redirect("/");
      return;
    }
  
    if (sessionRole == "super") {
      db.query(`SELECT * FROM Positions WHERE id = ${editID}`, (err, results) => {
        if (err) {
          req.flash("error_msg", `${err.sqlMessage}`);
          res.redirect("/admin");
        } else {
          if (results.length <= 0) {
            req.flash("error_msg", `no item  found`);
            return res.redirect("/admin");
          }
  
          let data = JSON.stringify(results);
          let positionData = JSON.parse(data);
  
          return res.render("positionEditForm", {
            pageTitle: "Edit Roles",
            name: sessionEmail,
            month: monthName,
            day: dayName,
            date: presentDay,
            year: presentYear,
            positionData,
          });
        }
      });
    } else {
      console.log("can not access this feature");
    }
  };


// put section

exports.editNewStore = (req, res) => {
  let updateID = req.params.id;

  const { Branch_Name, Branch_state, Branch_lga, Branch_address } = req.body;

  if (!(Branch_Name && Branch_state && Branch_lga && Branch_address)) {
    req.flash("error_msg", `Enter all field before submiting`);
    return res.redirect("/admin/edit-store");
  }

  // to prevent duplicates

  db.query(
    "SELECT * FROM Stores WHERE id = ?",
    [updateID],
    (error, results) => {
      if (error) {
        console.log(error);
        req.flash(
          "error_msg",
          `Error from server Database: ${error.sqlMessage}`
        );
        return res.redirect("/admin/all-stores");
      }

      if (results.length <= 0) {
        console.log(error);
        req.flash("error_msg", `"${Branch_Name}" alrready exist!`);
        return res.redirect("/admin/all-stores");
      }

      // do this
      db.query(`UPDATE Stores SET ? WHERE id ="${updateID}"`, {
        store_name: Branch_Name,
        store_address: Branch_address,
        state: Branch_state,
        lga: Branch_lga,
      });

      req.flash("success_msg", `"${Branch_Name}" edited successfully!`);
      return res.redirect("/admin/all-stores");
    }
  );
};

exports.editNewDiscount = (req, res) => {
  let updateID = req.params.id;

  const {
    Discount_name,
    Discount_Provider,
    Discount_Percentage,
    Start_Date,
    End_Date,
  } = req.body;

  if (!(Discount_name && Discount_Provider && Discount_Percentage)) {
    req.flash("error_msg", `Enter all field before submiting`);
    return res.redirect("/admin/create-discount");
  }

  if (!End_Date && Start_Date) {
    req.flash("error_msg", `Enter Date field before submiting`);
    return res.redirect("/admin/create-discount");
  }

  db.query(
    "SELECT * FROM Discount WHERE id = ?",
    [updateID],
    (error, results) => {
      if (error) {
        req.flash(
          "error_msg",
          `Error from server Database: ${error.sqlMessage}`
        );
        return res.redirect("/admin");
      }

      if (results.length <= 0) {
        // do this

        req.flash("error_msg", `"${Discount_name}" alrready exist!`);
        return res.redirect("/admin/all-discounts");
      }

      db.query(
        `UPDATE Discount SET ? WHERE id ="${updateID}"`,
        {
          Discount_name: Discount_name,
          Discount_Provider: Discount_Provider,
          Discount_percentage: Discount_Percentage,
          Start_Date: Start_Date,
          End_Date: End_Date,
        },
        (err, results) => {
          if (err) {
            req.flash(
              "error_msg",
              `"${err.sqlMessage}" Enter a valid date before submiting Discount`
            );
            return res.redirect("/admin/all-discounts");
          }

          req.flash("success_msg", `"${Discount_name}" Edited successfully!`);
          return res.redirect("/admin/all-discounts");
        }
      );
    }
  );
};

exports.editNewEmployee = (req, res) => {
  let updateID = req.params.id;

  console.log(req.body);

  const {
    First_name,
    Last_name,
    email,
    Contact_phone,
    Gender,
    State,
    lga,
    Position,
    Store,
    role,
  } = req.body;

  if (
    !(
      First_name &&
      Last_name &&
      email &&
      Contact_phone &&
      Gender &&
      State &&
      lga &&
      Position &&
      Store
    )
  ) {
    req.flash("error_msg", `Enter all field before submiting`);
    return res.redirect("/admin/create-employee");
  }

  db.query(
    "SELECT * FROM Employees WHERE id = ?",
    [updateID],
    (error, results) => {
      if (error) {
        req.flash(
          "error_msg",
          `Error from server Database: ${error.sqlMessage}`
        );
        return res.redirect("/admin");
      }

      if (results.length <= 0) {
        req.flash(
          "warning_msg",
          `"${First_name} ${Last_name}" does not exist!`
        );
        return res.redirect("/admin/all-employees");
      }

      let updateData = {
        First_name: First_name,
        Last_name: Last_name,
        email: email,
        Contact_phone: Contact_phone,
        Position: Position,
        Gender: Gender,
        Store: Store,
        State: State,
        lga: lga,
        userRole: role,
      };

      db.query(
        `UPDATE Employees SET ? WHERE id ="${updateID}"`,
        updateData,
        (err, results) => {
          if (err) {
            console.log(err);
            req.flash("error_msg", `"${err.sqlMessage}" `);
            return res.redirect("/admin/all-employees");
          }

          req.flash(
            "success_msg",
            `"${First_name} ${Last_name}" Edited successfully!`
          );
          return res.redirect("/admin/all-employees");
        }
      );
    }
  );
};


exports.editNewSupplier = (req, res) => {
  let editID = req.params.id;

  const { First_name, Last_name, email, Phone, Address } =
    req.body;

  if (!(First_name && Last_name && email && Phone && Address)) {
    req.flash("error_msg", `Enter all field before submiting`);
    return res.redirect("/admin/create-supplier");
  }

  db.query(
      "SELECT * FROM Suppliers WHERE id = ?",
      [editID],
      (error, results) => {
          if (error) {
              console.log(error);
              req.flash(
                  "error_msg",
                  `Error from server Database `
                  );
                  return res.redirect(`/admin/edit-supplier/${editID}`);
                }
                
                //   check if to hhave multiple
                if (results.length <= 0) {
                    req.flash("error_msg", `not found !`);
                    return res.redirect(`/admin/all-supplier`);
                }
                console.log("i got here");

      let updateData = {First_name: First_name,Last_name: Last_name,email: email,Phone: Phone,Address: Address }

      db.query(
        `UPDATE Suppliers SET ? WHERE id ="${editID}"`,
        updateData,
        (err, results) => {
          if (err) {
            console.log(err);
            req.flash("error_msg", `"${err.sqlMessage}" `);
            return res.redirect("/admin/all-supplier");
          }

          req.flash("success_msg", ` updated successfully! ${results}`);
          return res.redirect("/admin/all-supplier");
        }
      );
    }
  );
};

exports.editNewCategory = (req, res) => {
    let editID = req.params.id;
  
    const { Category_name, Desc } =
      req.body;
  
    if (!(Category_name && Desc)) {
      req.flash("error_msg", `Enter all field before submiting`);
      return res.redirect(`/admin/edit-category/${editID}`);
    }
  
    db.query(
        "SELECT * FROM Category WHERE CategoryID = ?",
        [editID],
        (error, results) => {
            if (error) {
                console.log(error);
                req.flash(
                    "error_msg",
                    `Error from server Database `
                    );
                    return res.redirect(`/admin`);
                  }
                  
                  //   check if to hhave multiple
                  if (results.length <= 0) {
                      req.flash("error_msg", `not found !`);
                      return res.redirect(`/admin/all-categories`);
                  }
  
        let updateData = {
            Category_name:Category_name,
            details:Desc
        }
  
        db.query(
          `UPDATE Category SET ? WHERE CategoryID ="${editID}"`,
          updateData,
          (err, results) => {
            if (err) {
              req.flash("error_msg", `"${err.sqlMessage}" `);
              return res.redirect("/admin/all-categories");
            }
  
            req.flash("success_msg", ` updated successfully! ${results}`);
            return res.redirect("/admin/all-categories");
          }
        );
      }
    );
  };

exports.editNewInventory = (req, res) => {
  
    let editID = req.params.id
    // req body
    const {
      Category_name,
      Brand_name,
      Product_name,
      Purchase_price,
      Supplier_name,
      Payment_method,
      Reciever_name,
      Delivery_method,
      QTY_recieved,
      total_in_pack,
      Manufacture_date,
      Expire_date,
      Cost_of_delivery,
      Total_damaged,
    } = req.body;
    // ensure all fields
    if (
      !(
        Category_name &&
        Brand_name &&
        Product_name &&
        Purchase_price &&
        Supplier_name &&
        Payment_method &&
        Reciever_name &&
        Delivery_method &&
        QTY_recieved &&
        total_in_pack &&
        Manufacture_date &&
        Expire_date &&
        Cost_of_delivery &&
        Total_damaged
      )
    ) {
      req.flash("error_msg", `Enter all field before submiting, check if you entered date again`);
      return res.redirect(`/admin/edit-inventory/${editID}`);
    }
  
    // create the inventory
    db.query(
      `UPDATE inventory SET ? WHERE id = "${editID}" `,
      {
        Category_name: Category_name,
        Brand_name: Brand_name,
        Product_name: Product_name,
        Purchase_price: Purchase_price,
        Supplier_name: Supplier_name,
        Payment_method: Payment_method,
        Reciever_name: Reciever_name,
        Delivery_method: Delivery_method,
        QTY_recieved: QTY_recieved,
        total_in_pack: total_in_pack,
        Manufacture_date: Manufacture_date,
        Expire_date: Expire_date,
        Cost_of_delivery: Cost_of_delivery,
        Total_damaged: Total_damaged,
      },
      (err, results) => {
        if (err) {
          req.flash("error_msg", `Error from server Database: ${err.sqlMessage}`);
          return res.redirect(`/admin/edit-inventory/${editID}`);
        } else {
          req.flash("success_msg", `"${Product_name}" Updated successfully!`);
          return res.redirect("/admin/all-inventory");
        }
      }
    );
  };
  exports.editNewPosition = (req, res) => {
    let editID = req.params.id;
    const sessionEmail = req.session.employees.email;
    const sessionRole = req.session.employees.userRole;
  
    if (!sessionEmail) {
      req.flash("error_msg", "No session, you are required to log in");
      res.redirect("/");
      return;
    }
  
    if (sessionRole == "super") {
      const { Position_name, Salary,Job_description } =
      req.body;
  
    if (!(Position_name && Salary && Job_description )) {
      req.flash("error_msg", `Enter all field before submiting`);
      return res.redirect(`/admin/edit-position/${editID}`);
    }

    // update

    let updateData = {
      Position_name:Position_name,
      Salary:Salary,
      Job_description:Job_description
    }

    db.query(
      `UPDATE Positions SET ? WHERE id ="${editID}"`,
      updateData,
      (err, results) => {
        if (err) {
          req.flash("error_msg", `"${err.sqlMessage}" `);
          return res.redirect("/admin/all-positions");
        }
        req.flash("success_msg", ` updated successfully! ${results}`);
        return res.redirect("/admin/all-positions");
      }
    );} else {
      console.log("can not access this feature");
    }
  };


  // delete req

  exports.deleteStore = (req, res) => {
  
    let editID = req.params.id
    const sessionEmail = req.session.employees.email; //  to get more info if needed
    const sessionRole = req.session.employees.userRole;

    if (sessionRole == "super") {
      db.query(`DELETE FROM Stores WHERE id = "${editID}"`, (err, results) => {
        if (err) {
          console.log(err);
          req.flash('error_msg', `could not delete: ${err.sqlMessage}`)
          return res.redirect('/')
        }
        req.flash('success_msg', `${editID} has been removed`)
        return res.redirect('/admin/all-stores')
      })

      return
    }else{
      req.flash('error_msg', `could not delete`)
      return res.redirect('/')
    }
    // req body


  };

  exports.deleteDiscount = (req, res) => {
  
    let editID = req.params.id
    const sessionEmail = req.session.employees.email; //  to get more info if needed
    const sessionRole = req.session.employees.userRole;

    if (sessionRole !== "super") {
      req.flash('error_msg', `could not delete:`)
      return res.redirect('/')
    }

    db.query(`DELETE FROM Discount WHERE id = "${editID}"`, (err, results) => {
      if (err) {
        console.log(err);
        req.flash('error_msg', `could not delete: ${err.sqlMessage}`)
        return res.redirect('/')
      }
      req.flash('success_msg', `${editID} has been removed`)
      return res.redirect('/admin/all-discounts')
    })
    return
  };


  exports.deleteEmployee = (req, res) => {
  
    let editID = req.params.id
    const sessionEmail = req.session.employees.email; //  to get more info if needed
    const sessionRole = req.session.employees.userRole;

    if (sessionRole !== "super") {
      req.flash('error_msg', `could not delete`)
      return res.redirect('/')
    }
    db.query(`DELETE FROM Employees WHERE id = "${editID}"`, (err, results) => {
      if (err) {
        console.log(err);
        req.flash('error_msg', `could not delete: ${err.sqlMessage}`)
        return res.redirect('/')
      }
      req.flash('success_msg', `${editID} has been removed`)
      return res.redirect('/admin/all-employees')
    })
  };

  exports.deleteSupplier = (req, res) => {
  
    let editID = req.params.id

    const sessionEmail = req.session.employees.email; //  to get more info if needed
    const sessionRole = req.session.employees.userRole;

    if (sessionRole !== "super") {
      req.flash('error_msg', `could not delete:`)
      return res.redirect('/')
    }

    db.query(`DELETE FROM Suppliers WHERE id = "${editID}"`, (err, results) => {
      if (err) {
        console.log(err);
        req.flash('error_msg', `could not delete: ${err.sqlMessage}`)
        return res.redirect('/')
      }
      req.flash('success_msg', `${editID} has been removed`)
      return res.redirect('/admin/all-supplier')
    })
  };

  exports.deleteCategory = (req, res) => {
  
    let editID = req.params.id

    const sessionEmail = req.session.employees.email; //  to get more info if needed
    const sessionRole = req.session.employees.userRole;

    if (sessionRole !== "super") {
      req.flash('error_msg', `could not delete:`)
      return res.redirect('/')
    }
    
    // req body
    db.query(`DELETE FROM Category WHERE CategoryID = "${editID}"`, (err, results) => {
      if (err) {
        console.log(err);
        req.flash('error_msg', `could not delete: ${err.sqlMessage}`)
        return res.redirect('/')
      }
      req.flash('success_msg', `${editID} has been removed`)
      return res.redirect('/admin/all-categories')
    })
  };

  exports.deleteInventory = (req, res) => {
  
    let editID = req.params.id

    const sessionEmail = req.session.employees.email; //  to get more info if needed
    const sessionRole = req.session.employees.userRole;

    if (sessionRole !== "super") {
      req.flash('error_msg', `could not delete:`)
      return res.redirect('/')
    }
    
    db.query(`DELETE FROM inventory WHERE id = "${editID}"`, (err, results) => {
      if (err) {
        req.flash('error_msg', `could not delete: ${err.sqlMessage}`)
        return res.redirect('/')
      }
      req.flash('success_msg', `${editID} has been removed`)
      return res.redirect('/admin/all-inventory')
    })
  };


  exports.deletePosition = (req, res) => {
  
    let editID = req.params.id

    const sessionEmail = req.session.employees.email; //  to get more info if needed
    const sessionRole = req.session.employees.userRole;

    if (sessionRole !== "super") {
      req.flash('error_msg', `could not delete:`)
      return res.redirect('/')
    }
    
    // req body
    db.query(`DELETE FROM Positions WHERE id = "${editID}"`, (err, results) => {
      if (err) {
        console.log(err);
        req.flash('error_msg', `could not delete: ${err.sqlMessage}`)
        return res.redirect('/')
      }
      req.flash('success_msg', `${editID} has been removed`)
      return res.redirect('/admin/all-positions')
    })
  };
  