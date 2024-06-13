const db = require("../model/databaseTable");
const stateData = require("../model/stateAndLGA");
const fs = require('fs'); // Use fs.promises for file operations

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


  let nameA = req.session.Users.First_name;
  let nameB = req.session.Users.Last_name;

  db.query(
    `SELECT * FROM Orders WHERE status = "canceled" `,
    (err, results) => {
      if (err) {
        console.log(err);
        req.flash("error_msg", `${err.sqlMessage}`);
        return res.redirect("/super");
      }
      let totalCanceledOrder = JSON.parse(JSON.stringify(results));

      db.query(
        `SELECT shipping_fee FROM Sales WHERE status = "resolved" `,
        (err, results) => {
          if (err) {
            console.log(err);
            req.flash("error_msg", `${err.sqlMessage}`);
            return res.redirect("/super");
          }
          let data = JSON.stringify(results);
          let shippingFee = JSON.parse(data);
    
          const shippingProfitMade = shippingFee.reduce(
            (acc, sale) => acc + sale.shipping_fee,
            0
          );
    
    
    
          db.query(
            `SELECT subTotal FROM Order_Products WHERE status = "returned" `,
            (err, results) => {
              if (err) {
                console.log(err);
                req.flash("error_msg", `${err.sqlMessage}`);
                return res.redirect("/super");
              }
              let data = JSON.stringify(results);
              let returnedAmount = JSON.parse(data);
      
              const returnedSum = returnedAmount.reduce(
                (acc, item) => acc + item.price_per_item,
                0
              );
      
              // to get total sales made
              db.query(
                `SELECT total_amount FROM Sales WHERE status = "resolved" `,
                (err, results) => {
                  if (err) {
                    console.log(err);
                    req.flash("error_msg", `${err.sqlMessage}`);
                    return res.redirect("/super");
                  }
                  let data = JSON.stringify(results);
                  let allSalesAmount = JSON.parse(data);
      
                  const salesMade = allSalesAmount.reduce(
                    (acc, item) => acc + item.total_amount,
                    0
                  );
      
                  let totalAmount = salesMade - returnedSum;
      
                  let formatedProfit = totalAmount.toLocaleString("en-US");
                  // const averageAmount = totalAmount / allSalesAmount.length;
      
                  db.query(
                    `SELECT * FROM Orders WHERE status = 'complete'  `,
                    (err, results) => {
                      if (err) {
                        req.flash("error_msg", `${err.sqlMessage}`);
                        return res.redirect("/super");
                      }
                      let data = JSON.stringify(results);
                      let orderData = JSON.parse(data);
      
                      let completedOrders = orderData.length;
      
                      db.query(
                        `SELECT * FROM Orders WHERE status = 'incomplete' OR status = "waiting"`,
                        (err, results) => {
                          if (err) {
                            req.flash("error_msg", `${err.sqlMessage}`);
                            return res.redirect("/super");
                          }
                          let data = JSON.stringify(results);
                          let pendingOrderData = JSON.parse(data);
      
                          let pendingOrders = pendingOrderData.length;
      
                          db.query(
                            `SELECT * FROM Order_Products WHERE status = 'returned' `,
                            (err, results) => {
                              if (err) {
                                req.flash("error_msg", `${err.sqlMessage}`);
                                return res.redirect("/super");
                              }
                              let data = JSON.stringify(results);
                              let allReturnsOrders = JSON.parse(data);
      
                              db.query(
                                `SELECT * FROM Sales WHERE status = 'resolved' `,
                                (err, results) => {
                                  if (err) {
                                    req.flash("error_msg", `${err.sqlMessage}`);
                                    return res.redirect("/super");
                                  } else {
                                    let data = JSON.stringify(results);
                                    let allSales = JSON.parse(data);
                                    let totalNumberOfSales = allSales.length;
      
                                    allSales.forEach((sales) => {
                                      sales.created_date = formatDate(
                                        sales.created_date
                                      ); // Assuming 'date' is the date field in your supplier table
                                    });
      
                                    db.query(
                                      `SELECT * FROM Suppliers `,
                                      (err, results) => {
                                        if (err) {
                                          console.log(err.sqlMessage);
                                          req.flash("error_msg", `${err.sqlMessage}`);
                                          return res.redirect("/super");
                                        }
      
                                        // check if item exist
      
                                        let data = JSON.stringify(results);
                                        let supplierData = JSON.parse(data);
      
                                        // render form

                                              db.query(
                                                `SELECT * FROM Stores `,
                                                (err, results) => {
                                                  if (err) {
                                                    req.flash(
                                                      "error_msg",
                                                      `${err.sqlMessage}`
                                                    );
                                                    return res.redirect("/super");
                                                  } else {
                                                    let data =
                                                      JSON.stringify(results);
                                                    let allStores = JSON.parse(data);
      
                                                 

                                                            // total reg customers
                                                            db.query(
                                                              `SELECT * FROM Users WHERE userRole = ?`, ["user"],
                                                              (err, results) => {
                                                                if (err) {
                                                                  req.flash(
                                                                    "error_msg",
                                                                    ` ${err.sqlMessage}`
                                                                  );
                                                                  return res.redirect(
                                                                    "/"
                                                                  );
                                                                } else {
                                                                  let totalVerifiedUsers =
                                                                    results.length;



                                                                  res.render(
                                                                    "./super/superHome",
                                                                    {
                                                                      pageTitle:
                                                                        "Welcome",
                                                                      name: `${nameA} ${nameB}`,
                                                                      month:monthName,
                                                                      day: dayName,
                                                                      date: presentDay,
                                                                      year: presentYear,
                                                                      userActive:true,
                                                                      totalVerifiedUsers,
                                                                      stateData,
                                                                      supplierData,
                                                                      allStores,
                                                                      // recorrds to display
                                                                      allSales,
                                                                      totalNumberOfSales,
                                                                      allReturnsOrders,
                                                                      formatedProfit,
                                                                      pendingOrders,
                                                                      completedOrders,
                                                                      totalCanceledOrder,
                                                                    }
                                                                  );
                                                                }
                                                              }
                                                            );


                                                  }
                                                }
                                              ); // stores

                                      }
                                    ); // all suppliers
                                  }
                                }
                              ); // all sales
                            }
                          ); // returned products
                        }
                      ); // pending orders query
                    }
                  ); // total completed orders
                }
              );
            }
          ); // to get total amount  of returned items
        }
      ); // shippingProfitMade

    }) // total number of canceled order



};

// All employees table
exports.getAllEmployees = (req, res) => {
  const sessionEmail = req.session.Users.email;
  const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;

   // to get list of all employees
   db.query(
    `SELECT * FROM Users WHERE userRole = "admin" OR userRole = "super" `,
    (err, results) => {
      if (err) {
        console.log(err.sqlMessage);
        req.flash("error_msg", `${err.sqlMessage}`);
        return res.redirect("/super");
      }

      let data = JSON.stringify(results);
      let allUsers = JSON.parse(data);

        // hence add to form
        res.render("./super/employeeTable", {
          pageTitle: "All Employees",
          name: `${userFirstName} ${userLastName}`,
          month: monthName,
          day: dayName,
          date: presentDay,
          year: presentYear,
          allUsers,

        });
    }
  );

};

exports.getAllUsersToUpgrade = (req, res) => {
  const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;
    // to get list of all employees
    db.query(
      `SELECT * FROM Users WHERE userRole = "user" `,
      (err, results) => {
        if (err) {
          console.log(err.sqlMessage);
          req.flash("error_msg", `${err.sqlMessage}`);
          return res.redirect("/super");
        }

        let data = JSON.stringify(results);
        let allUsers = JSON.parse(data);
          // hence add to form
          res.render("./super/userUpgrade", {
            pageTitle: "All users to upgrade",
            name: `${userFirstName} ${userLastName}`,
            month: monthName,
            day: dayName,
            date: presentDay,
            year: presentYear,
            allUsers,
          });
      }
    );
};

exports.usersToUpgrade = (req, res) => {
  const editId = req.params.id;

  const sessionEmail = req.session.Users.email;
  const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;

    db.query(`SELECT * FROM Positions `, (err, results) => {
      if (err) {
        req.flash("error_msg", `${err.sqlMessage}`);
        res.redirect("/super");
      } else {
        let data = JSON.stringify(results);
        let allPositions = JSON.parse(data);

        db.query(`SELECT * FROM Stores `, (err, results) => {
          if (err) {
            req.flash("error_msg", `${err.sqlMessage}`);
            res.redirect("/super");
          } else {
            let data = JSON.stringify(results);
            let allStores = JSON.parse(data);

            // to get list of all employees
            db.query(
              `SELECT * FROM Users WHERE id = "${editId}" `,
              (err, results) => {
                if (err) {
                  req.flash("error_msg", `${err.sqlMessage}`);
                  return res.redirect("/super");
                }
                let data = JSON.stringify(results);
                let allUsers = JSON.parse(data);

                // get list of all categories

                // hence add to form
                res.render("./super/userEditUpgrade", {
                  pageTitle: "All users",
                  name: `${userFirstName} ${userLastName}`,
                  month: monthName,
                  day: dayName,
                  date: presentDay,
                  year: presentYear,
                  stateData,
                  allUsers,
                  allPositions,
                  allStores,
                });
              }
            );
          }
        });
      }
    });

};

exports.postUsersToUpgrade = (req, res) => {
  const editId = req.params.id;

  const { store_name, position } = req.body;

  if (!(store_name && position )) {
    req.flash("error_msg", `please enter all fields`);
    return res.redirect(`/super/upgrade-users/${editId}`);
  }

  console.log("hi");
  db.query(`SELECT * FROM Positions WHERE Position_name = ?`, [position], (err, results) => {
    if (err) {
      req.flash('error_msg', `Error getting category: ${err.sqlMessage}`);
      return res.redirect('/super');
    }

    if (results.length === 0) {
      req.flash('error_msg', `position not found`);
      return res.redirect('/super');
    }

    let positionData = JSON.parse(JSON.stringify(results));
    let positionId = positionData[0].id;
    let positionSalary = positionData[0].Salary;
  
    db.query(`SELECT * FROM Stores WHERE store_name = ?`, [store_name], (err, results) => {
      if (err) {
        req.flash('error_msg', `Error getting category: ${err.sqlMessage}`);
        return res.redirect('/super');
      }
  
      if (results.length === 0) {
        req.flash('error_msg', `Store not found`);
        return res.redirect('/super');
      }
  
      let storeData = JSON.parse(JSON.stringify(results));
      let storeId = storeData[0].id;
      db.query(
        `UPDATE Users SET ? WHERE id = ${editId}`,
        {
          userRole: "admin",
          store_name: store_name,
          salary: positionSalary,
          position: position,
          position_id:positionId,
          store_id:storeId,
  
        },
        (err, results) => {
          if (err) {
            console.log('success');
            req.flash("error_msg", `error udating user ${err.sqlMessage}`);
            return res.redirect("/super/upgrade-users");
          }
          req.flash("success_msg", `successful`);
          return res.redirect("/super/upgrade-users");
        }
      );
    })
  
  })



};

// All unresolved  sales table
exports.getAllSales = (req, res) => {
  const sessionEmail = req.session.Users.email;
  const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;


      db.query(
        `SELECT * FROM Sales WHERE status  = 'unresolved' `,
        (err, results) => {
          if (err) {
            req.flash("error_msg", ` ${err.sqlMessage}`);
            return res.redirect("/super");
          } else {
            let data = JSON.stringify(results);
            let allSales = JSON.parse(data);

            allSales.forEach((date) => {
              date.created_date = formatDate(date.created_date); // Assuming 'date' is the date field in your supplier table
            });

            res.render("./super/salesTable", {
              pageTitle: "Welcome",
              name: `${userFirstName} ${userLastName}`,
              month: monthName,
              day: dayName,
              date: presentDay,
              year: presentYear,
              allSales,
            });
          }
        }
      );

};

// All Damaged table
exports.getAllDamaged = (req, res) => {
  const sessionEmail = req.session.Users.email;

  const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;

    db.query(`SELECT * FROM Suppliers `, (err, results) => {
      if (err) {
        console.log(err.sqlMessage);
        req.flash("error_msg", `${err.sqlMessage}`);
        res.redirect("/super");
      }

      // check if item exist

      let data = JSON.stringify(results);
      let supplierData = JSON.parse(data);

      // render form
      db.query(`SELECT * FROM Damaged `, (err, results) => {
        if (err) {
          req.flash("error_msg", ` ${err.sqlMessage}`);
          return res.redirect("/");
        } else {
          let data = JSON.stringify(results);
          let allDamaged = JSON.parse(data);

          res.render("./super/damageTable", {
            pageTitle: "Welcome",
            name: `${userFirstName} ${userLastName}`,
            month: monthName,
            day: dayName,
            date: presentDay,
            year: presentYear,
            allDamaged,
          });
        }
      });
    });
};

// all customers tabble
exports.getAllCustomers = (req, res) => {
  const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;
      // hence add to form
      db.query(
        `SELECT * FROM Users WHERE userRole = 'user'`,
        (err, results) => {
          if (err) {
            req.flash("error_msg", ` ${err.sqlMessage}`);
            return res.redirect("/");
          } else {
            let data = JSON.stringify(results);
            let allCustomers = JSON.parse(data);
            allCustomers.forEach((customers) => {
              customers.created_date = formatDate(
                customers.created_date
              ); // Assuming 'date' is the date field in your customers table
              customers.Previous_visit = formatDate(
                customers.Previous_visit
              ); // Assuming 'date' is the date field in your Discount table
            });

            res.render("./super/customersTable", {
              pageTitle: "Welcome",
              name: `${userFirstName} ${userLastName}`,
              month: monthName,
              day: dayName,
              date: presentDay,
              year: presentYear,
              allCustomers,
            });
          }
        }
      );
};

// all customers tabble
exports.getAllSuppliers = (req, res) => {

  const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;

  db.query(`SELECT * FROM Suppliers `, (err, results) => {
    if (err) {
      req.flash("error_msg", ` ${err.sqlMessage}`);
      return res.redirect("/");
    } else {
      let data = JSON.stringify(results);
      let allSuppliers = JSON.parse(data);

      allSuppliers.forEach((supplier) => {
        supplier.created_date = formatDate(
          supplier.created_date
        ); // Assuming 'date' is the date field in your supplier table
      });
      res.render("./super/supplierTable", {
        pageTitle: "All suppliers",
        name: `${userFirstName} ${userLastName}`,
        month: monthName,
        day: dayName,
        date: presentDay,
        year: presentYear,
        allSuppliers,
      });
    }
  });
};

// all stores tabble
exports.getAllStores = (req, res) => {
  const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;


  db.query(`SELECT * FROM Stores `, (err, results) => {
    if (err) {
      req.flash("error_msg", ` ${err.sqlMessage}`);
      return res.redirect("/");
    } else {
      let data = JSON.stringify(results);
      let allStores = JSON.parse(data);

      res.render("./super/storesTable", {
        pageTitle: "Welcome",
        name: `${userFirstName} ${userLastName}`,
        month: monthName,
        day: dayName,
        date: presentDay,
        year: presentYear,
        allStores,

      });
    }
  });
};

// all stores tabble
exports.getAllDiscounts = (req, res) => {

  const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;
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

      res.render("./super/discountTable", {
        pageTitle: "Welcome",
        name: `${userFirstName} ${userLastName}`,
        month: monthName,
        day: dayName,
        date: presentDay,
        year: presentYear,
        allDiscounts,
      });
    }
  });
};
// all cats
exports.getAllCategory = (req, res) => {

  const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;

  db.query(`SELECT * FROM Category `, (err, results) => {
    if (err) {
      req.flash("error_msg", ` ${err.sqlMessage}`);
      return res.redirect("/");
    } else {
      let data = JSON.stringify(results);
      let allCategory = JSON.parse(data);

      res.render("./super/categoryTable", {
        pageTitle: "Welcome",
        name: `${userFirstName} ${userLastName}`,
        month: monthName,
        day: dayName,
        date: presentDay,
        year: presentYear,
        allCategory,

      });
    }
  });
};

// all Products
exports.getAllProducts = (req, res) => {

  const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;

  db.query(`SELECT * FROM Products  `, (err, results) => {
    if (err) {
      req.flash("error_msg", ` ${err.sqlMessage}`);
      return res.redirect("/");
    } else {
      let data = JSON.stringify(results);
      let allProducts = JSON.parse(data);

      // allProducts.forEach((products) => {
      //   products.created_date = formatDate(
      //     products.created_date
      //   ); // Assuming 'date' is the date field in your supplier table
      //   products.Manufacture_date = formatDate(
      //     products.Manufacture_date
      //   ); // Assuming 'date' is the date field in your supplier table
      //   products.Expire_date = formatDate(
      //     products.Expire_date
      //   ); // Assuming 'date' is the date field in your supplier table
      // });
      // const itemsWithDaysLeft = results.map(item => {
      //   const today = new Date();
      //   let correctedExpireDate = formatDate(item.Expire_date)
      //   let correctedManufactureDate = formatDate(item.Manufacture_date)
      //   const expiryDate = new Date(correctedExpireDate);

      //   // Calculate the difference in milliseconds between expiry date and today's date
      //   const timeDifference = expiryDate.getTime() - today.getTime();

      //   // Convert the difference from milliseconds to days
      //   const daysLeft = Math.ceil(timeDifference / (1000 * 3600 * 24));

      //   return {
      //     id: item.id,
      //     manufacture_date: correctedManufactureDate,
      //     expiry_date: correctedExpireDate,
      //     days_left: daysLeft
      //   };
      // });

      // const prodcutDataToAdd = allProducts.map(item => {
      //   const correspondingWatchData = itemsWithDaysLeft.find(watchItem => watchItem.id === item.id);
      //   return {
      //     ...item,
      //     watchData: correspondingWatchData
      //   };
      // });

      // console.log(prodcutDataToAdd);

      res.render("./super/productsTable", {
        pageTitle: "All products",
        name: `${userFirstName} ${userLastName}`,
        month: monthName,
        day: dayName,
        date: presentDay,
        year: presentYear,
        allProducts,

      });
    }
  });
};
// all transac
exports.getAllTransactions = (req, res) => {

  const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;

   // total reg transactions
   db.query(`SELECT * FROM Transactions `, (err, results) => {
    if (err) {
      req.flash("error_msg", ` ${err.sqlMessage}`);
      return res.redirect("/");
    } else {
      let data = JSON.stringify(results);
      let allTransactions = JSON.parse(data);

      allTransactions.forEach((sales) => {
        sales.TransactionDate = formatDate(
          sales.TransactionDate
        ); // Assuming 'date' is the date field in your supplier table
      });

      res.render("./super/transactionTable", {
        pageTitle: "All Transactions",
        name: `${userFirstName} ${userLastName}`,
        month: monthName,
        day: dayName,
        date: presentDay,
        year: presentYear,
        allTransactions,

      });
    }
  });
};

// all Inventory
exports.getAllInventory = (req, res) => {
  const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;

     // to get invent table
     db.query(`SELECT * FROM inventory `, (err, results) => {
      if (err) {
        req.flash("error_msg", ` ${err.sqlMessage}`);
        return res.redirect("/super");
      } else {
        let data = JSON.stringify(results);
        let inventoryData = JSON.parse(data);

        // to reformat the date
        inventoryData.forEach((inventory) => {
          inventory.created_date = formatDate(
            inventory.created_date
          ); // Assuming 'date' is the date field in your supplier table
          inventory.Manufacture_date = formatDate(
            inventory.Manufacture_date
          ); // Assuming 'date' is the date field in your supplier table
          inventory.Expire_date = formatDate(
            inventory.Expire_date
          ); // Assuming 'date' is the date field in your supplier table
        });

        // getting inventory data
        const itemsWithDaysLeft = results.map((item) => {
          const today = new Date();
          let correctedExpireDate = formatDate(
            item.Expire_date
          );
          let correctedManufactureDate = formatDate(
            item.Manufacture_date
          );
          const expiryDate = new Date(correctedExpireDate);

          // Calculate the difference in milliseconds between expiry date and today's date
          const timeDifference =
            expiryDate.getTime() - today.getTime();

          // Convert the difference from milliseconds to days
          const daysLeft = Math.ceil(
            timeDifference / (1000 * 3600 * 24)
          );

          return {
            id: item.id,
            manufacture_date: correctedManufactureDate,
            expiry_date: correctedExpireDate,
            days_left: daysLeft,
          };
        });

        // Map through the original data and add watch data to each item
        const allInventory = inventoryData.map((item) => {
          const correspondingWatchData = itemsWithDaysLeft.find(
            (watchItem) => watchItem.id === item.id
          );
          return {
            ...item,
            watchData: correspondingWatchData,
          };
        });

        return res.render("./super/inventoryTable", {
          pageTitle: "All Inventory",
          name: `${userFirstName} ${userLastName}`,
          month: monthName,
          day: dayName,
          date: presentDay,
          year: presentYear,
          allInventory,
        });
      }
    });
};

// all Positions
exports.getAllPositions = (req, res) => {

  const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;
    // to get invent table
    db.query(`SELECT * FROM Positions `, (err, results) => {
      if (err) {
        req.flash("error_msg", ` ${err.sqlMessage}`);
        return res.redirect("/super");
      } else {
        let data = JSON.stringify(results);
        let allPosition = JSON.parse(data);

        return res.render("./super/positionTable", {
          pageTitle: "All Inventory",
          name: `${userFirstName} ${userLastName}`,
          month: monthName,
          day: dayName,
          date: presentDay,
          year: presentYear,
          allPosition,

  
        });
      }
    });
};

exports.getAllOrders = (req, res) => {
  const sessionEmail = req.session.Users.email;

  const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;

  db.query(
    `SELECT * FROM Orders ORDER BY id DESC`,
    (err, results) => {
      if (err) {
        req.flash(
          "error_msg",
          `error for db: ${err.sqlState}`
        );
        return res.redirect("/");
      }
      let data = JSON.stringify(results);
      let allOrders = JSON.parse(data);

      // to get invent table

      return res.render("./super/ordersTable", {
        pageTitle: "All Orders",
        name: `${userFirstName} ${userLastName}`,
        month: monthName,
        day: dayName,
        date: presentDay,
        year: presentYear,
        allOrders,

      });
    }
  );
};

exports.getAllCanceledOrders = (req, res) => {
  const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;

  db.query(
    `SELECT * FROM Orders WHERE status = ? ORDER BY id DESC`,["canceled"],
    (err, results) => {
      if (err) {
        req.flash(
          "error_msg",
          `error for db: ${err.sqlState}`
        );
        return res.redirect("/");
      }
      let canceledResults = JSON.parse(JSON.stringify(results));

      // to get invent table

      return res.render("./super/canceledTable", {
        pageTitle: "All Canceled Orders",
        name: `${userFirstName} ${userLastName}`,
        month: monthName,
        day: dayName,
        date: presentDay,
        year: presentYear,
        canceledResults,

      });
    }
  );
};

exports.getOneCanceledOrder = (req, res) => {


  const viewId = req.params.id
  const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;

  db.query(
    `SELECT * FROM Orders WHERE id = ? ORDER BY id DESC`,[viewId],
    (err, results) => {
      if (err) {
        req.flash(
          "error_msg",
          `error for db: ${err.sqlState}`
        );
        return res.redirect("/");
      }
      let canceledResults = JSON.parse(JSON.stringify(results));

      // to get the user that made the order

      db.query(` SELECT * FROM Users WHERE id = ?`, [canceledResults[0].customer_id], (error, results)=>{
        if (error) {
          console.log(error);
          req.flash('error_msg', `error ${error.sqlMessage}`)
          return res.redirect('/super')
        }
        let userMakingTheOrder = JSON.parse(JSON.stringify(results[0]));
        let Fullname = userMakingTheOrder.First_name + ' ' + userMakingTheOrder.Last_name

        // the  products ordered
        db.query( `SELECT * FROM Order_products WHERE sale_id = ?`, [canceledResults[0].sale_id], (err, results)=>{
          if (err) {
            console.log(err);
            req.flash('error_msg', `error ${err.sqlMessage}`)
            return res.redirect('/super')
          }
          let orderedItemsResults = JSON.parse(JSON.stringify(results));
  
        return res.render("./super/canceledDetails", {
          pageTitle: `${Fullname} Canceled Orders`,
          name: `${userFirstName} ${userLastName}`,
          month: monthName,
          day: dayName,
          date: presentDay,
          year: presentYear,
          canceledResults,
          orderedItemsResults,
          Fullname
  
        });
        })
      })

      // to get the  products ordered
     

 
    }
  );
};

exports.getAllLogisticCompany = (req, res) => {
  const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;

  db.query(
    `SELECT * FROM Logistics`,
    (err, results) => {
      if (err) {
        req.flash(
          "error_msg",
          `error for db: ${err.sqlState}`
        );
        return res.redirect("/");
      }
      let logisticsResults = JSON.parse(JSON.stringify(results));

      // to get invent table

      return res.render("./super/logisticsCompanyTable", {
        pageTitle: "All Canceled Orders",
        name: `${userFirstName} ${userLastName}`,
        month: monthName,
        day: dayName,
        date: presentDay,
        year: presentYear,
        logisticsResults,

      });
    }
  );
};
exports.getOneLogisticCompany = (req, res) => {


  const viewId = req.params.id
  const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;

  db.query(
    `SELECT * FROM Logistics WHERE id = ? `,[viewId],
    (err, results) => {
      if (err) {
        req.flash(
          "error_msg",
          `error for db: ${err.sqlState}`
        );
        return res.redirect("/");
      }
      let logisticsResults = JSON.parse(JSON.stringify(results[0]));

      // to get the user that made the order
      return res.render("./super/logisticCompanyEditForm", {
        pageTitle: ` edit logistics`,
        name: `${userFirstName} ${userLastName}`,
        month: monthName,
        day: dayName,
        date: presentDay,
        year: presentYear,
        logisticsResults,
      });
    }
  );
};


exports.allLogisticDrivers = (req, res) => {


  const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;

  // modifiy to user posiotn id
  db.query(
    `SELECT * FROM Users WHERE Position = 'Logistics' `,
    (err, results) => {
      if (err) {
        req.flash(
          "error_msg",
          `error for db: ${err.sqlState}`
        );
        return res.redirect("/");
      }
      let logisticsResults = JSON.parse(JSON.stringify(results));

      // to get the user that made the order
      return res.render("./super/logisticUsersTable", {
        pageTitle: ` edit logistics`,
        name: `${userFirstName} ${userLastName}`,
        month: monthName,
        day: dayName,
        date: presentDay,
        year: presentYear,
        logisticsResults,
      });
    }
  );
};

exports.asigneToCompany = (req, res) => {

  
  const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;

  db.query(
    `SELECT * FROM Users WHERE id = ? `, [req.params.id],
    (err, results) => {
      if (err) {
        req.flash( "error_msg",`error for db: ${err.sqlState}`);
        return res.redirect("/");
      }
      let allUsers = JSON.parse(JSON.stringify(results));
      db.query(
        `SELECT * FROM Logistics `,
        (err, results) => {
          if (err) {
            req.flash( "error_msg",`error for db: ${err.sqlState}`);
            return res.redirect("/");
          }
          let allLogistics = JSON.parse(JSON.stringify(results));
    
          // to get the user that made the order
          return res.render("./super/logisticsAsigneToCompanyForm", {
            pageTitle: ` add to company logistics`,
            name: `${userFirstName} ${userLastName}`,
            month: monthName,
            day: dayName,
            date: presentDay,
            year: presentYear,
            allLogistics,
            allUsers
          });
        }
      );
    })
  // modifiy to user posiotn id
 
};

exports.addDriverToCompany = (req, res) => {
  const editId = req.params.id;

  const { company } = req.body;

  if (!(company )) {
    req.flash("error_msg", `please Select before submitting`);
    return res.redirect(`/super/add-driver-to-company/${editId}`);
  }

      db.query(
        `UPDATE Users SET ? WHERE id = ${editId}`,
        {
          logistic_id: company,
        },
        (err, results) => {
          if (err) {
            req.flash("error_msg", `error udating user ${err.sqlMessage}`);
            return res.redirect("/super/");
          }
          req.flash("success_msg", `successful`);
          return res.redirect("/super/");
        }
      );



};


// get the for 

exports.createStorePage = (req, res) => {

  let nameA = req.session.Users.First_name;
  let nameB = req.session.Users.Last_name;

  res.render(
    "./super/storesCreateForm",
    {
      pageTitle:
        "Welcome",
      name: `${nameA} ${nameB}`,
      month:monthName,
      day: dayName,
      date: presentDay,
      year: presentYear,
      stateData,
    }
  );

};


exports.createDiscountPage = (req, res) => {

  let nameA = req.session.Users.First_name;
  let nameB = req.session.Users.Last_name;

  res.render(
    "./super/discountCreateForm",
    {
      pageTitle:
        "Welcome",
      name: `${nameA} ${nameB}`,
      month:monthName,
      day: dayName,
      date: presentDay,
      year: presentYear,
      stateData,
    }
  );

};

exports.createCategoryPage = (req, res) => {


  let nameA = req.session.Users.First_name;
  let nameB = req.session.Users.Last_name;

  res.render(
    "./super/categoryCreateForm",
    {
      pageTitle:
        "Welcome",
      name: `${nameA} ${nameB}`,
      month:monthName,
      day: dayName,
      date: presentDay,
      year: presentYear,
      stateData,
    }
  );

};
exports.createSupplierPage = (req, res) => {


  let nameA = req.session.Users.First_name;
  let nameB = req.session.Users.Last_name;

  res.render(
    "./super/supplierCreateForm",
    {
      pageTitle:
        "Welcome",
      name: `${nameA} ${nameB}`,
      month:monthName,
      day: dayName,
      date: presentDay,
      year: presentYear,
      stateData,
    }
  );

};
exports.createPositionPage = (req, res) => {


  let nameA = req.session.Users.First_name;
  let nameB = req.session.Users.Last_name;

  res.render(
    "./super/positionCreateForm",
    {
      pageTitle:
        "Welcome",
      name: `${nameA} ${nameB}`,
      month:monthName,
      day: dayName,
      date: presentDay,
      year: presentYear,
      stateData,
    }
  );

};
exports.createLogisticCompanyPage = (req, res) => {


  let nameA = req.session.Users.First_name;
  let nameB = req.session.Users.Last_name;

  res.render(
    "./super/logisticsCreateForm",
    {
      pageTitle:
        "Welcome",
      name: `${nameA} ${nameB}`,
      month:monthName,
      day: dayName,
      date: presentDay,
      year: presentYear,
      stateData,
    }
  );

};

exports.createInventoryPage = (req, res) => {
  const sessionEmail = req.session.Users.email;

  let nameA = req.session.Users.First_name;
  let nameB = req.session.Users.Last_name;

  db.query(`SELECT * FROM Suppliers `,(err, results) => {
      if (err) {
        req.flash("error_msg", `${err.sqlMessage}`);
        return res.redirect("/super");
      }
      // check if item exist
      let supplierData = JSON.parse(JSON.stringify(results));
      // render form

            db.query(`SELECT * FROM Stores `,(err, results) => {
                if (err) {
                  req.flash("error_msg",`${err.sqlMessage}`);
                  return res.redirect("/super");
                } else {
                  let allStores = JSON.parse(JSON.stringify(results));
                  // to get list of all employees
                  db.query(`SELECT * FROM Users WHERE userRole ="super" ORDER BY id DESC`,(err, results) => {
                      if (err) {
                        req.flash("error_msg",`${err.sqlMessage}`);
                        return res.redirect("/super");
                      }
                      let superAdmin = JSON.parse(JSON.stringify(results));
                      // get list of all categories
                      db.query(`SELECT * FROM Category `, (err, results) => {
                          if (err) {
                            req.flash("error_msg",`${err.sqlMessage}`);
                            res.redirect("/super");
                            return;
                          }
                          let categoryData =  JSON.parse(JSON.stringify(results));
                          res.render("./super/inventoryCreateForm",{
                            pageTitle:"Welcome",
                            name: `${nameA} ${nameB}`,
                            month:monthName,
                            day: dayName,
                            date: presentDay,
                            year: presentYear,
                            stateData,
                            categoryData,
                            supplierData,
                            superAdmin,
                            allStores,
                  });
              });
          })
        }
    })
  })
};




// createReturn

exports.createReturn = (req, res) => {

  const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;
  return res.render("./super/returnForm", {
    pageTitle: "return",
    name: `${userFirstName} ${userLastName}`,
    month: monthName,
    day: dayName,
    date: presentDay,
    year: presentYear,

  });
};

// single item
exports.getInventoryById = (req, res) => {
  let singleId = req.params.id;
  const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;

  db.query(
    `SELECT * FROM inventory WHERE id = "${singleId}" `,
    (err, results) => {
      if (err) {
        req.flash("error_msg", ` ${err.sqlMessage}`);
        return res.redirect("/super");
      } else {
        let data = JSON.stringify(results);
        let allInventory = JSON.parse(data);

        // to reformat the date
        allInventory.forEach((inventory) => {
          inventory.created_date = formatDate(
            inventory.created_date
          ); // Assuming 'date' is the date field in your supplier table
          inventory.Manufacture_date = formatDate(
            inventory.Manufacture_date
          ); // Assuming 'date' is the date field in your supplier table
          inventory.Expire_date = formatDate(
            inventory.Expire_date
          ); // Assuming 'date' is the date field in your supplier table
        });

        return res.render("./super/inventorySingle", {
          pageTitle: `${allInventory[0].Product_name} | ${allInventory[0].Brand_name}`,
          name: `${userFirstName} ${userLastName}`,
          month: monthName,
          day: dayName,
          date: presentDay,
          year: presentYear,
          allInventory,
        });
      }
    }
  );
};

// add price page

exports.getAddpricePage = (req, res) => {

  let singleId = req.params.id;
  const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;

  db.query(
    `SELECT * FROM inventory WHERE id = "${singleId}" `,
    (err, results) => {
      if (err) {
        req.flash("error_msg", ` ${err.sqlMessage}`);
        return res.redirect("/super");
      } else {

        let allInventory = JSON.parse(JSON.stringify(results));

        // to reformat the date
        allInventory.forEach((inventory) => {
          inventory.created_date = formatDate(
            inventory.created_date
          ); // Assuming 'date' is the date field in your supplier table
          inventory.Manufacture_date = formatDate(
            inventory.Manufacture_date
          ); // Assuming 'date' is the date field in your supplier table
          inventory.Expire_date = formatDate(
            inventory.Expire_date
          ); // Assuming 'date' is the date field in your supplier table
        });

        return res.render("./super/addPricePage", {
          pageTitle: `${allInventory[0].Product_name} | ${allInventory[0].Brand_name}`,
          name: `${userFirstName} ${userLastName}`,
          month: monthName,
          day: dayName,
          date: presentDay,
          year: presentYear,
          allInventory,
        });
      }
    }
  );
};

exports.getAddpriceUpdatePage = (req, res) => {

  let singleId = req.params.id;
  const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;

  db.query(
    `SELECT * FROM inventory WHERE id = "${singleId}" `,
    (err, results) => {
      if (err) {
        req.flash("error_msg", ` ${err.sqlMessage}`);
        return res.redirect("/super");
      } else {

        let allInventory = JSON.parse(JSON.stringify(results));

        // to reformat the date
        allInventory.forEach((inventory) => {
          inventory.created_date = formatDate(
            inventory.created_date
          ); // Assuming 'date' is the date field in your supplier table
          inventory.Manufacture_date = formatDate(
            inventory.Manufacture_date
          ); // Assuming 'date' is the date field in your supplier table
          inventory.Expire_date = formatDate(
            inventory.Expire_date
          ); // Assuming 'date' is the date field in your supplier table
        });

        return res.render("./super/addPriceUpdatePage", {
          pageTitle: `${allInventory[0].Product_name} | ${allInventory[0].Brand_name}`,
          name: `${userFirstName} ${userLastName}`,
          month: monthName,
          day: dayName,
          date: presentDay,
          year: presentYear,
          allInventory,
        });
      }
    }
  );
};

//  at the counter page
exports.adminCounter = (req, res) => {
  const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;


  db.query(`SELECT * FROM Category `, (err, results) => {
    if (err) {
      req.flash("error_msg", ` ${err.sqlMessage}`);
      return res.redirect("/");
    } else {
      let data = JSON.stringify(results);
      let allCategory = JSON.parse(data);
      res.render("./super/superCounter", {
        pageTitle: "At the counter",
        name: `${userFirstName} ${userLastName}`,
        month: monthName,
        day: dayName,
        date: presentDay,
        year: presentYear,
        allCategory,
      });
    }
  });
};

// invoice of an order
exports.invoice = (req, res) => {
  const saleId  = req.params.id
    const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;

  db.query(`SELECT * FROM Order_Products WHERE sale_id = "${saleId}"`, (err, results) => {
    if (err) {
      req.flash("error_msg", ` ${err.sqlMessage}`);
      return res.redirect("/");
    } else {
      let data = JSON.stringify(results);
      let newOrderProducts = JSON.parse(data);

      db.query(`SELECT * FROM Sales WHERE sale_id =" ${saleId}"`, (err, results) => {
        if (err) {
          req.flash("error_msg", ` ${err.sqlMessage}`);
          return res.redirect("/");
        } else {
          let data = JSON.stringify(results);
          let newSale = JSON.parse(data);
          const cartItems = newSale
// Calculate the total subtotal
  
          return res.render("./super/saleInvoice", {
            pageTitle: "invoice",
            name: `${userFirstName} ${userLastName}`,
            month: monthName,
            day: dayName,
            date: presentDay,
            year: presentYear,
            newSale,
            newOrderProducts,
            totalSubtotal: newSale[0].total_amount
          }); // for admin only
          // not user
        }
      });
    }
  }) // products ordered

   
};







// post req

exports.createNewCategory = (req, res) => {

  const { Category_name, Desc } = req.body;

  db.query(
    "SELECT * FROM Category WHERE Category_name = ?",
    [Category_name],
    (error, results) => {
      if (error) {
        req.flash(
          "error_msg",
          `Error from server Database: ${error.sqlMessage}`
        );
        return res.redirect("/super");
      }

      if (results.length <= 0) {
        // do this
        db.query("INSERT INTO Category SET ?", {
          Category_name: Category_name,
          details: Desc,
        });

        req.flash("success_msg", `"${Category_name}" added successfully!`);
        return res.redirect("/super");
      }
      req.flash("error_msg", `"${Category_name}" alrready exist!`);
      return res.redirect("/super");
    }
  );
};

exports.createNewSupplier = (req, res) => {
  const { First_name, Last_name, email, Phone, Address, Business_name } =
    req.body;

  if (
    !(First_name && Last_name && email && Phone && Address, Business_name)
  ) {
    req.flash("error_msg", `Enter all field before submiting`);
    return res.redirect("/super");
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
        return res.redirect("/super");
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
        return res.redirect("/super/all-supplier");
      }
      req.flash("error_msg", `"${Business_name}" alrready exist!`);
      return res.redirect("/super");
    }
  );
};

exports.createNewStore = (req, res) => {
  const { Branch_Name, Branch_state, Branch_lga, Branch_address } = req.body;

  if (!(Branch_Name && Branch_state && Branch_lga && Branch_address)) {
    req.flash("error_msg", `Enter all field before submiting Store`);
    return res.redirect("/super");
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
        return res.redirect("/super");
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
        return res.redirect("/super");
      }
      req.flash("error_msg", `"${Branch_Name}" alrready exist!`);
      return res.redirect("/super");
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
    return res.redirect("/super");
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
        return res.redirect("/super");
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
        return res.redirect("/super/all-discounts");
      }
      req.flash("error_msg", `"${Discount_name}" alrready exist!`);
      return res.redirect("/super");
    }
  );
};

exports.createNewInventory = (req, res) => {
  // req body

  let supplierId 
  let filename;

  // Setting the image name from the uploaded file
  if (req.file) {
    filename = req.file.filename;
  } else {
    filename = "default.jpg";
  }



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

  // Ensure all fields are filled
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
    req.flash("error_msg", `Enter all fields before submitting`);
    return res.redirect("/super");
  }


  
  // Get the ID of the Supplier

  db.query(`SELECT * FROM Suppliers WHERE Business_name = ?`, [Supplier_name], (err, results) => {
    if (err) {
      req.flash('error_msg', `Error getting category: ${err.sqlMessage}`);
      return res.redirect('/super');
    }

    if (results.length != 0) {
      supplierData = JSON.parse(JSON.stringify(results));
      supplierId = supplierData[0].id;
    }else {
      supplierId = 0

    }



    db.query(`SELECT * FROM Category WHERE Category_name = ?`, [Category_name], (err, results) => {
      if (err) {
        req.flash('error_msg', `Error getting category: ${err.sqlMessage}`);
        return res.redirect('/super');
      }
  
      if (results.length === 0) {
        req.flash('error_msg', `Category not found`);
        return res.redirect('/super');
      }
  
      let categoryData = JSON.parse(JSON.stringify(results));
      let categoryId = categoryData[0].CategoryID;
  
      db.query(
        "INSERT INTO inventory SET ?",
        {
          Category_name: Category_name,
          Brand_name: Brand_name,
          Product_name: Product_name,
          Purchase_price: Purchase_price,
          category_id: categoryId,
          supplier_id:supplierId,
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
          image:filename,
        },
        (err, results) => {
          if (err) {
            req.flash("error_msg", `Error from server Database: ${err.sqlMessage}`);
            return res.redirect("/super");
          } else {
            req.flash("success_msg", `"${Product_name}" added successfully!`);
            return res.redirect("/super");
          }
        }
      );
    });
  })
 


  // Get the ID of the category

};


exports.createNewCustomer = (req, res) => {

  const { First_name, Last_name, email, Phone, Address } = req.body;

  if (!(First_name && Last_name && email && Phone && Address)) {
    req.flash("error_msg", `Enter all field before submiting`);
    return res.redirect("/super");
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
        return res.redirect("/super");
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
        return res.redirect("/super");
      }
      req.flash("error_msg", `"${First_name}" alrready exist!`);
      return res.redirect("/super");
    }
  );
};

exports.createNewPosition = (req, res) => {

  const { Position_name, Salary, Job_description } = req.body;

  if (!(Position_name && Salary && Job_description)) {
    req.flash("error_msg", `Enter all field before submiting`);
    return res.redirect("/super");
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
        return res.redirect("/super");
      }

      if (results.length <= 0) {
        // do this
        db.query("INSERT INTO Positions SET ?", {
          Position_name: Position_name,
          Salary: Salary,
          Job_description: Job_description,
        });

        req.flash("success_msg", `"${Position_name}" added successfully!`);
        return res.redirect("/super");
      }
      req.flash("error_msg", `"${Position_name}" alrready exist!`);
      return res.redirect("/super");
    }
  );
};
exports.createNewLogistics = (req, res) => {

  const { name, phone, email, address } = req.body;

  if (!(name && phone && email && address)) {
    req.flash("error_msg", `Enter all field before submiting`);
    return res.redirect("/super");
  }

  db.query(
    "SELECT * FROM Logistics WHERE name = ?",
    [name],
    (error, results) => {
      if (error) {
        req.flash(
          "error_msg",
          `Error from server Database: ${error.sqlMessage}`
        );
        return res.redirect("/super");
      }

      if (results.length <= 0) {
        // do this
        db.query("INSERT INTO Logistics SET ?", {
          name: name,
          email: email,
          address: address,
          phone:phone,
        });

        req.flash("success_msg", `"${name}" added successfully!`);
        return res.redirect("/super");
      }
      req.flash("error_msg", `"${name}" alrready exist!`);
      return res.redirect("/super");
    }
  );
};






exports.returnProcessor = (req, res) => {

  const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;
  let errors = [];

  const { searchId } = req.body;

  db.query(
    `SELECT * FROM Order_Products WHERE sale_id  = ${searchId} AND status = "sold"`,
    (err, results) => {
      if (err) {
        console.log(err);
        req.flash("error_msg", `${err.sqlMessage}`);
        res.redirect("/super");
      }

      let data = JSON.stringify(results);
      let productsData = JSON.parse(data);

      db.query(
        `SELECT * FROM Sales WHERE sale_id  = ${searchId} `,
        (err, results) => {
          if (err) {
            console.log(err);
            req.flash("error_msg", `${err.sqlMessage}`);
            res.redirect("/super");
          }

          let data = JSON.stringify(results);
          let salesData = JSON.parse(data);

          db.query(`SELECT * FROM Suppliers `, (err, results) => {
            if (err) {
              console.log(err.sqlMessage);
              req.flash("error_msg", `${err.sqlMessage}`);
              res.redirect("/super");
            }

            // check if item exist

            let data = JSON.stringify(results);
            let supplierData = JSON.parse(data);

            // render form

            db.query(`SELECT * FROM Positions `, (err, results) => {
              if (err) {
                req.flash("error_msg", `${err.sqlMessage}`);
                res.redirect("/super");
              } else {
                let data = JSON.stringify(results);
                let allPositions = JSON.parse(data);

                db.query(`SELECT * FROM Stores `, (err, results) => {
                  if (err) {
                    req.flash("error_msg", `${err.sqlMessage}`);
                    res.redirect("/super");
                  } else {
                    let data = JSON.stringify(results);
                    let allStores = JSON.parse(data);

                    // to get list of all employees
                    db.query(
                      `SELECT * FROM Users WHERE userRole = "admin" `,
                      (err, results) => {
                        if (err) {
                          console.log(err.sqlMessage);
                          req.flash("error_msg", `${err.sqlMessage}`);
                          res.redirect("/super");
                        }

                        // check if item exist
                        if (results.length <= 0) {
                          console.log("employee is empty");
                          req.flash(
                            "error_msg",
                            `Cannot create inventory when Admin list is empty`
                          );
                          res.redirect(`/`);
                          return;
                        }

                        let data = JSON.stringify(results);
                        let allUsers = JSON.parse(data);

                        // get list of all categories
                        db.query(
                          `SELECT * FROM Category `,
                          (err, results) => {
                            if (err) {
                              console.log(err);
                              req.flash("error_msg", `${err.sqlMessage}`);
                              res.redirect("/super");
                              return;
                            }
                            // check if item exist
                            if (results.length <= 0) {
                              console.log("category is empty");
                              req.flash(
                                "error_msg",
                                `Cannot create inventory when category is empty`
                              );
                              res.redirect(`/`);
                              return;
                            }

                            // get the items to send to front end

                            let data = JSON.stringify(results);
                            let categoryData = JSON.parse(data);

                            // hence add to form

                            errors.push({
                              msg: `make sure you read and understand return plolicies`,
                            });
                            // to get invent table
                            return res.render("./super/returnProcssor", {
                              pageTitle: "return details",
                              errors,
                              name: `${userFirstName} ${userLastName}`,
                              month: monthName,
                              day: dayName,
                              date: presentDay,
                              year: presentYear,
                            });
                          }
                        );
                      }
                    );
                  }
                });
              }
            });
          });
        }
      );
    }
  );
};





// price form to add to shelf
exports.addToShelfForSale = (req, res) => {

  const updateID = req.params.id;
  const { price } = req.body;
  // if user is admin
  if (!price) {
    req.flash("error_msg", `Enter Price before submiting to add to shelf`);
    return res.redirect("/super");
  }
  // retreive the data from inventroy table
  db.query(
    `SELECT * FROM inventory WHERE id = "${updateID}" `,
    (err, results) => {
      if (err) {
        req.flash("error_msg", `${err.sqlMessage}`);
        res.redirect("/super");
      } else {
        let data = JSON.stringify(results);
        let inventoryDataFromDb = JSON.parse(data);

        // check if its in pro db
        db.query(
          `SELECT * FROM Products WHERE inventory_id = "${updateID}" `,
          (err, results) => {
            if (err) {
              console.log(err);
              req.flash("error_msg", `${err.sqlMessage}`);
              res.redirect("/super");
            }

            if (results.length <= 0) {
              // no record found with such id in products

              let totalInStock =
                inventoryDataFromDb[0].QTY_recieved *
                inventoryDataFromDb[0].total_in_pack;
              let totalOnShelf =
                totalInStock - inventoryDataFromDb[0].Total_damaged;

              // object to be inserted
              let prodcutDataToAdd = {
                Brand_name: inventoryDataFromDb[0].Brand_name,
                ProductName: inventoryDataFromDb[0].Product_name,
                category: inventoryDataFromDb[0].Category_name,
                inventory_id: inventoryDataFromDb[0].id,
                UnitPrice: null,
                StockQuantity: inventoryDataFromDb[0].QTY_recieved,
                total_in_pack: inventoryDataFromDb[0].total_in_pack,
                total_on_shelf: totalOnShelf,
                created_date: sqlDate,
                activate: inventoryDataFromDb[0].activate,
                image: inventoryDataFromDb[0].image,
                category_id: inventoryDataFromDb[0].category_id,
              };

              // adding to products table
              db.query(
                "INSERT INTO Products SET ?",
                prodcutDataToAdd,
                (err, results) => {
                  if (err) {
                    req.flash("error_msg", `${err.sqlMessage}`);
                    return res.redirect("/");
                  }

                  // item does has no price
                  db.query(
                    `UPDATE Products SET ? WHERE inventory_id = "${updateID}"`,
                    { UnitPrice: price, activate: "yes" },
                    (err, results) => {
                      if (err) {
                        req.flash(
                          "error_msg",
                          `Error from server Database: ${err.sqlMessage}`
                        );
                        return res.redirect("/");
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
                            return res.redirect("/super");
                          }

                          req.flash(
                            "success_msg",
                            `price added, now available to be sold in shelf`
                          );
                          return res.redirect("/super");
                        }
                      );
                    }
                  );
                }
              );
            } else {
              // record found, no need to add just render price form

              // updated inventory table
              db.query(
                `UPDATE inventory SET ? WHERE id =  "${updateID}"`,
                {
                  activate: "yes",
                },
                (err, results) => {
                  if (err) {
                    console.log(err);
                    req.flash("error_msg", `error for db: ${err.sqlMessage}`);
                    return res.redirect("/super");
                  }

                  // update  shelf table
                  db.query(
                    `UPDATE Products SET ? WHERE inventory_id =  "${updateID}"`,
                    {
                      activate: "yes",
                    },
                    (err, results) => {
                      if (err) {
                        console.log(err);
                        req.flash(
                          "error_msg",
                          `error for db: ${err.sqlMessage}`
                        );
                        return res.redirect("/super");
                      }
                      req.flash(
                        "success_msg",
                        `new price added as ${price} and status is actived`
                      );
                      res.redirect("/super");
                    }
                  );
                }
              );
            }
          }
        );
      }
    }
  );
};

// activate on inventory
exports.remove = (req, res) => {

  let pageId = req.params.id;

  db.query(
    `SELECT * FROM inventory WHERE id = "${pageId}"`,
    (err, results) => {
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
          res.redirect("/super/all-inventory");
          return;
        }
      );
    }
  );
};

// edit section

// form
exports.storeEdit = (req, res) => {
  let editID = req.params.id;
  const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;


  db.query(
    `SELECT * FROM Stores WHERE id = ${editID}`,
    (err, results) => {
      if (err) {
        req.flash(
          "error_msg",
          `${err.sqlMessage}`
        );
        return res.redirect("/super");
      } else {
        if (results.length <= 0) {
          req.flash(
            "error_msg",
            `no item  found`
          );
          return res.redirect("/super");
        }

        let data = JSON.stringify(results);
        let storeData = JSON.parse(data);

        return res.render(
          "./super/storesEditForm",
          {
            pageTitle: "Welcome",
            name: `${userFirstName} ${userLastName}`,
            month: monthName,
            day: dayName,
            date: presentDay,
            year: presentYear,
            storeData,
            stateData

          }
        );
      }
    }
  ); // edit data queryy
};

exports.editDiscount = (req, res) => {
  let editID = req.params.id;

  const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;

  db.query(
    `SELECT * FROM Discount WHERE id = ${editID}`,
    (err, results) => {
      if (err) {
        req.flash("error_msg", `${err.sqlMessage}`);
        return res.redirect("/super");
      } else {
        if (results.length <= 0) {
          req.flash("error_msg", `no item  found`);
          return res.redirect("/super");
        }

        let data = JSON.stringify(results);
        let discountData = JSON.parse(data);
        console.log(discountData);

        return res.render(
          "./super/discountEditForm",
          {
            pageTitle: "Discount",
            name: `${userFirstName} ${userLastName}`,
            month: monthName,
            day: dayName,
            date: presentDay,
            year: presentYear,
            discountData,
          }
        );
      }
    }
  );
};



exports.editEmployee = (req, res) => {
  let editID = req.params.id;

  const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;

  db.query(`SELECT * FROM Stores `, (err, results) => {
    if (err) {
      req.flash("error_msg", `${err.sqlMessage}`);
      return res.redirect("/super");
    } else {
      let data = JSON.stringify(results);
      let allStores = JSON.parse(data);

      db.query(`SELECT * FROM Positions `, (err, results) => {
        if (err) {
          req.flash("error_msg", `${err.sqlMessage}`);
          return res.redirect("/super");
        } else {
          let data = JSON.stringify(results);
          let allPositions = JSON.parse(data);

          db.query(
            `SELECT * FROM Employees WHERE id = ${editID}`,
            (err, results) => {
              if (err) {
                req.flash("error_msg", `${err.sqlMessage}`);
                return res.redirect("/super");
              } else {
                if (results.length <= 0) {
                  req.flash("error_msg", `no item  found`);
                  return res.redirect("/super");
                }

                let data = JSON.stringify(results);
                let allUsers = JSON.parse(data);

                res.render("./super/employeeEditForm", {
                  pageTitle: "Edit Employee",
                  name: `${userFirstName} ${userLastName}`,
                  month: monthName,
                  day: dayName,
                  date: presentDay,
                  year: presentYear,
                  stateData,
                  allUsers,
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

  const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;

  db.query(`SELECT * FROM Suppliers WHERE id = ${editID}`, (err, results) => {
    if (err) {
      req.flash("error_msg", `${err.sqlMessage}`);
      res.redirect("/super");
    } else {
      if (results.length <= 0) {
        req.flash("error_msg", `no item  found`);
        return res.redirect("/super");
      }

      let data = JSON.stringify(results);
      let supplierData = JSON.parse(data);

      return res.render("./super/supplierEditForm", {
        pageTitle: "Edit Supplier",
        name: `${userFirstName} ${userLastName}`,
        month: monthName,
        day: dayName,
        date: presentDay,
        year: presentYear,
        supplierData,
      });
    }
  });
};

exports.editCategory = (req, res) => {
  let editID = req.params.id;
  const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;
  db.query(
    `SELECT * FROM Category WHERE CategoryID = "${editID}"`,
    (err, results) => {
      if (err) {
        req.flash("error_msg", `${err.sqlMessage}`);
        return res.redirect("/super/all-categories");
      }

      let data = JSON.stringify(results);
      let categoryData = JSON.parse(data);

      return res.render("./super/categoryEditForm", {
        pageTitle: "edit Cat",
        name: `${userFirstName} ${userLastName}`,
        month: monthName,
        day: dayName,
        date: presentDay,
        year: presentYear,
        categoryData,
      });
    }
  );
};

exports.editInventory = (req, res) => {
  let editID = req.params.id;
  const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;


  console.log(req.session.Users);


  db.query(`SELECT * FROM Suppliers `, (err, results) => {
    if (err) {
      req.flash("error_msg", `${err.sqlMessage}`);
      return res.redirect("/super/all-inventory");
    }

    let data = JSON.stringify(results);
    let supplierData = JSON.parse(data);

    db.query(
      `SELECT * FROM Users WHERE userRole = "super" `,
      (err, results) => {
        if (err) {
          req.flash("error_msg", `${err.sqlMessage}`);
          return res.redirect("/super/all-inventory");
        }

        let data = JSON.stringify(results);
        let allUsers = JSON.parse(data);
        // cats
        db.query(`SELECT * FROM Category `, (err, results) => {
          if (err) {
            req.flash("error_msg", `${err.sqlMessage}`);
            return res.redirect("/super/all-inventory");
          }

          let data = JSON.stringify(results);
          let categoryData = JSON.parse(data);

          db.query(
            `SELECT * FROM inventory WHERE id = "${editID}"`,
            (err, results) => {
              if (err) {
                req.flash("error_msg", `${err.sqlMessage}`);
                return res.redirect("/super/all-inventory");
              }

              let data = JSON.stringify(results);
              let inventoryData = JSON.parse(data);

              res.render("./super/inventoryEditForm", {
                pageTitle: "edit inventory",
                name: `${userFirstName} ${userLastName}`,
                month: monthName,
                day: dayName,
                date: presentDay,
                year: presentYear,
                inventoryData,
                categoryData,
                allUsers,
                supplierData,
                stateData,
              });
            }
          ); // inventory
        }); // category
      }
    ); // employee
  }); // supplier
};

exports.editPosition = (req, res) => {
  let editID = req.params.id;
  const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;

  db.query(`SELECT * FROM Positions `, (err, results) => {
    if (err) {
      req.flash("error_msg", `${err.sqlMessage}`);
      return res.redirect("/super");
    } else {
      let data = JSON.stringify(results);
      let allPositions = JSON.parse(data);

      db.query(
        `SELECT * FROM Stores `,
        (err, results) => {
          if (err) {
            req.flash("error_msg", `${err.sqlMessage}`);
            return res.redirect("/super");
          } else {
            let data = JSON.stringify(results);
            let allStores = JSON.parse(data);

            // to get list of all employees
            db.query(
              `SELECT * FROM Users `,
              (err, results) => {
                if (err) {
                  console.log(err.sqlMessage);
                  req.flash(
                    "error_msg",
                    `${err.sqlMessage}`
                  );
                  return res.redirect("/super");
                }

                // check if item exist
                if (results.length <= 0) {
                  console.log("employee is empty");
                  req.flash(
                    "error_msg",
                    `Cannot create inventory when Admin list is empty`
                  );
                  res.redirect(`/super/`);
                  return;
                }

                let data = JSON.stringify(results);
                let allUsers = JSON.parse(data);

                // get list of all categories
                db.query(
                  `SELECT * FROM Category `,
                  (err, results) => {
                    if (err) {
                      console.log(err);
                      req.flash(
                        "error_msg",
                        `${err.sqlMessage}`
                      );
                      res.redirect("/super");
                      return;
                    }
                    // check if item exist
                    if (results.length <= 0) {
                      console.log("category is empty");
                      req.flash(
                        "error_msg",
                        `Cannot create inventory when category is empty`
                      );
                      res.redirect(`/`);
                      return;
                    }

                    // get the items to send to front end

                    let data = JSON.stringify(results);
                    let categoryData = JSON.parse(data);

                    // hence add to form
                    // total reg customers
                    db.query(
                      `SELECT * FROM Positions WHERE id = ${editID}`,
                      (err, results) => {
                        if (err) {
                          req.flash(
                            "error_msg",
                            `${err.sqlMessage}`
                          );
                          res.redirect("/super");
                        } else {
                          if (results.length <= 0) {
                            req.flash(
                              "error_msg",
                              `no item  found`
                            );
                            return res.redirect("/super");
                          }

                          let data =
                            JSON.stringify(results);
                          let positionData =
                            JSON.parse(data);

                          return res.render(
                            "./super/positionEditForm",
                            {
                              pageTitle: "Edit Roles",
                              name: `${userFirstName} ${userLastName}`,
                              month: monthName,
                              day: dayName,
                              date: presentDay,
                              year: presentYear,
                              positionData,
                              allPositions,
                              stateData,
                              categoryData,
                              allUsers,
                              allStores,
                            }
                          );
                        }
                      }
                    );
                  }
                );
              }
            );
          }
        }
      ); // stores
    }
  }); // all positions
};




exports.editEmployee = (req, res) => {
  let editID = req.params.id;
  const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;


  db.query(`SELECT * FROM Positions `, (err, results) => {
    if (err) {
      req.flash("error_msg", `${err.sqlMessage}`);
      return res.redirect("/super");
    } else {
      let data = JSON.stringify(results);
      let allPositions = JSON.parse(data);

      db.query(`SELECT * FROM Stores `, (err, results) => {
        if (err) {
          req.flash("error_msg", `${err.sqlMessage}`);
          return res.redirect("/super");
        } else {
          let data = JSON.stringify(results);
          let allStores = JSON.parse(data);

          // to get list of all employees
          db.query(
            `SELECT * FROM Users WHERE id = "${editID}" `,
            (err, results) => {
              if (err) {
                req.flash("error_msg", `${err.sqlMessage}`);
                return res.redirect("/super");
              }

              // check if item exist
              if (results.length <= 0) {
                console.log("employee not found");
                req.flash(
                  "error_msg",
                  `Cannot create inventory when Admin list is empty`
                );
                res.redirect(`/super/`);
                return;
              }

              let data = JSON.stringify(results);
              let allUsers = JSON.parse(data);

              return res.render("./super/employeeEditUpgrade", {
                pageTitle: "Edit Employee",
                name: `${userFirstName} ${userLastName}`,
                month: monthName,
                day: dayName,
                date: presentDay,
                year: presentYear,
                allPositions,
                allUsers,
                allStores,
              });
            }
          );
        }
      }); // stores
    }
  }); // all positions
};

// put section
exports.updateEmployee = (req, res) => {
  const updateID = req.params.id;
  const { store_name, position, Salary } = req.body;

// i need to get the id for store name and position

  if (!(store_name && position && Salary)) {
    req.flash("error_msg", `Enter all field before updating Employee`);
    return res.redirect("/super/all-employees");
  }

  db.query(`SELECT * FROM Positions WHERE Position_name = ?`, [position], (err, results) => {
    if (err) {
      req.flash('error_msg', `Error getting category: ${err.sqlMessage}`);
      return res.redirect('/super');
    }

    if (results.length === 0) {
      req.flash('error_msg', `position not found`);
      return res.redirect('/super');
    }

    let positionData = JSON.parse(JSON.stringify(results));
    let positionId = positionData[0].id;
    // Get the ID of the category
    db.query(`SELECT * FROM Stores WHERE store_name = ?`, [store_name], (err, results) => {
      if (err) {
        req.flash('error_msg', `Error getting category: ${err.sqlMessage}`);
        return res.redirect('/super');
      }
  
      if (results.length === 0) {
        req.flash('error_msg', `Store not found`);
        return res.redirect('/super');
      }
  
      let storeData = JSON.parse(JSON.stringify(results));
      let storeId = storeData[0].id;

      console.log(storeData);
        // do this
  db.query(`UPDATE Users SET ? WHERE id ="${updateID}"`, {
    store_name: store_name,
    store_id:storeId,
    position_id:positionId,
    position: position,
    Salary: Salary,
  });

  req.flash("success_msg", `edited successfully!`);
  return res.redirect("/super/all-employees");

    })
  })



};

exports.editNewStore = (req, res) => {
  let updateID = req.params.id;
  const { Branch_Name, Branch_state, Branch_lga, Branch_address } = req.body;

  if (!(Branch_Name && Branch_state && Branch_lga && Branch_address)) {
    req.flash("error_msg", `Enter all field before submiting`);
    return res.redirect("/super/edit-store");
  }

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
        return res.redirect("/super/all-stores");
      }

      if (results.length <= 0) {
        console.log(error);
        req.flash("error_msg", `"${Branch_Name}" alrready exist!`);
        return res.redirect("/super/all-stores");
      }

      // do this
      db.query(`UPDATE Stores SET ? WHERE id ="${updateID}"`, {
        store_name: Branch_Name,
        store_address: Branch_address,
        state: Branch_state,
        lga: Branch_lga,
      });

      req.flash("success_msg", `"${Branch_Name}" edited successfully!`);
      return res.redirect("/super/all-stores");
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
    return res.redirect("/super");
  }

  if (!End_Date && Start_Date) {
    req.flash("error_msg", `Enter Date field before submiting`);
    return res.redirect("/super");
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
        return res.redirect("/super");
      }

      if (results.length <= 0) {
        // do this

        req.flash("error_msg", `"${Discount_name}" alrready exist!`);
        return res.redirect("/super/all-discounts");
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
            return res.redirect("/super/all-discounts");
          }

          req.flash("success_msg", `"${Discount_name}" Edited successfully!`);
          return res.redirect("/super/all-discounts");
        }
      );
    }
  );
};

exports.editNewSupplier = (req, res) => {
  let editID = req.params.id;
  const { First_name, Last_name, email, Phone, Address } = req.body;

  if (!(First_name && Last_name && email && Phone && Address)) {
    req.flash("error_msg", `Enter all field before submiting`);
    return res.redirect("/super/create-supplier");
  }

  db.query(
    "SELECT * FROM Suppliers WHERE id = ?",
    [editID],
    (error, results) => {
      if (error) {
        console.log(error);
        req.flash("error_msg", `Error from server Database `);
        return res.redirect(`/super/edit-supplier/${editID}`);
      }

      //   check if to hhave multiple
      if (results.length <= 0) {
        req.flash("error_msg", `not found !`);
        return res.redirect(`/super/all-supplier`);
      }
      console.log("i got here");

      let updateData = {
        First_name: First_name,
        Last_name: Last_name,
        email: email,
        Phone: Phone,
        Address: Address,
      };

      db.query(
        `UPDATE Suppliers SET ? WHERE id ="${editID}"`,
        updateData,
        (err, results) => {
          if (err) {
            console.log(err);
            req.flash("error_msg", `"${err.sqlMessage}" `);
            return res.redirect("/super/all-supplier");
          }

          req.flash("success_msg", ` updated successfully! ${results}`);
          return res.redirect("/super/all-supplier");
        }
      );
    }
  );
};

exports.editNewCategory = (req, res) => {
  let editID = req.params.id;

  const { Category_name, Desc } = req.body;

  if (!(Category_name && Desc)) {
    req.flash("error_msg", `Enter all field before submiting`);
    return res.redirect(`/super/edit-category/${editID}`);
  }

  db.query(
    "SELECT * FROM Category WHERE CategoryID = ?",
    [editID],
    (error, results) => {
      if (error) {
        console.log(error);
        req.flash("error_msg", `Error from server Database `);
        return res.redirect(`/`);
      }

      //   check if to hhave multiple
      if (results.length <= 0) {
        req.flash("error_msg", `not found !`);
        return res.redirect(`/super/all-categories`);
      }

      let updateData = {
        Category_name: Category_name,
        details: Desc,
      };

      db.query(
        `UPDATE Category SET ? WHERE CategoryID ="${editID}"`,
        updateData,
        (err, results) => {
          if (err) {
            req.flash("error_msg", `"${err.sqlMessage}" `);
            return res.redirect("/super/all-categories");
          }
          db.query(
            "SELECT * FROM Products WHERE category_id = ?",
            [editID],
            (error, results) => {
              if (error) {
                console.log(error);
                req.flash("error_msg", `Error from server Database `);
                return res.redirect(`/`);
              }
        
              if (results.length <= 0) {
                req.flash("success_msg", ` updated successfully!`);
                  return res.redirect("/super/all-categories");
              }
        // new cat shpuld e added to shelf too
              db.query(
                `UPDATE Products SET ? WHERE category_id ="${editID}"`,
                {
                  category:Category_name,
                },
                (err, results) => {
                  if (err) {
                    req.flash("error_msg", `"${err.sqlMessage}" `);
                    return res.redirect("/super/all-categories");
                  }
                  req.flash("success_msg", ` updated successfully!`);
                  return res.redirect("/super/all-categories");
        
                }
              );
            }
            )
          // 
        }
      );
    }
  );// category itself is done
    
};





exports.editNewInventory = (req, res) => {

  let editID = req.params.id;
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
    req.flash(
      "error_msg",
      `Enter all field before submiting, check if you entered date again`
    );
    return res.redirect(`/super/edit-inventory/${editID}`);
  }

let updateData =       {
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
}

  db.query(
    "SELECT * FROM Products WHERE inventory_id = ?",
    [editID],
    (error, results) => {
      if (error) {
        req.flash("error_msg", `Error from server Database `);
        return res.redirect(`/`);
      }

      // item not in shelf yet
      if (results.length <= 0) {
        // create the inventory
      return  db.query(
          `UPDATE inventory SET ? WHERE id = "${editID}" `,
          [updateData],
          (err, results) => {
            if (err) {
              req.flash(
                "error_msg",
                `Error from server Database: ${err.sqlMessage}`
              );
              return res.redirect(`/super/edit-inventory/${editID}`);
            } else {
              req.flash("success_msg", `"${Product_name}" Updated successfully!`);
              return res.redirect("/super/all-inventory");
            }
          }
        );
      }



      db.query(
        `UPDATE Products SET ? WHERE inventory_id = "${editID}" `,
        {
          category: Category_name,
          Brand_name: Brand_name,
          inventory_id:editID,
          ProductName: Product_name,
          StockQuantity: QTY_recieved,
          total_in_pack: total_in_pack,
        },
        (err, results) => {
          if (err) {
            req.flash(
              "error_msg",
              `Error from server Database: ${err.sqlMessage}`
            );
            return res.redirect(`/super/edit-inventory/${editID}`);
          }


          db.query(
            `UPDATE inventory SET ? WHERE id = "${editID}" `,
            [updateData],
            (err, results) => {
              if (err) {
                req.flash(
                  "error_msg",
                  `Error from server Database: ${err.sqlMessage}`
                );
                return res.redirect(`/super/edit-inventory/${editID}`);
              } else {
                req.flash("success_msg", `"${Product_name}" Updated successfully!`);
                return res.redirect("/super/all-inventory");
              }
            }
          );

        }
      );
  
    // create the inventory
  
    })



};


exports.editNewPosition = (req, res) => {
  let editID = req.params.id;


  const { Position_name, Salary, Job_description } = req.body;

  if (!(Position_name && Salary && Job_description)) {
    req.flash("error_msg", `Enter all field before submiting`);
    return res.redirect(`/super/edit-position/${editID}`);
  }

  // update

  let updateData = {
    Position_name: Position_name,
    Salary: Salary,
    Job_description: Job_description,
  };

  db.query(
    `UPDATE Positions SET ? WHERE id ="${editID}"`,
    updateData,
    (err, results) => {
      if (err) {
        req.flash("error_msg", `"${err.sqlMessage}" `);
        return res.redirect("/super/all-positions");
      }
      req.flash("success_msg", ` updated successfully! ${results}`);
      return res.redirect("/super/all-positions");
    }
  );
};

exports.updatePrice = (req, res) => {
  let editID = req.params.id;

  const { price } = req.body;

  if (!(price)) {
    req.flash("error_msg", `Enter new price`);
    return res.redirect(`/super/all-products/`);
  }

  // update

  let updateData = {
    UnitPrice: price,
  };

  db.query(
    `UPDATE Products SET ? WHERE id ="${editID}"`,
    updateData,
    (err, results) => {
      if (err) {
        req.flash("error_msg", `"${err.sqlMessage}" `);
        return res.redirect("/super/all-products");
      }
      req.flash("success_msg", ` updated successfully!`);
      return res.redirect("/super/all-products");
    }
  );
};

exports.resolveSale = (req, res) => {
  const editID = req.params.id;
  db.query(
    `SELECT * FROM Sales WHERE id = ?`,
    [editID],
    (err, salesResults) => {
      if (err) {
        req.flash("error_msg", `Error from database: ${err.sqlMessage}`);
        return res.redirect("/");
      }

      if (salesResults.length === 0) {
        req.flash("error_msg", "Sale not found");
        return res.redirect("/super/all-sales");
      }

      const salesData = salesResults[0];
      db.query(
        `SELECT * FROM Order_Products WHERE sale_id = ?`,
        [salesData.sale_id],
        (err, orderResults) => {
          if (err) {
            req.flash("error_msg", `Error from database: ${err.sqlMessage}`);
            return res.redirect("/");
          }

          const productQuantities = {};

          orderResults.forEach((productBought) => {
            const { product_id, quantity } = productBought;
            if (productQuantities[product_id]) {
              productQuantities[product_id] += quantity;
            } else {
              productQuantities[product_id] = quantity;
            }
          });

          const promises = Object.entries(productQuantities).map(
            ([product_id, quantity]) => {
              return new Promise((resolve, reject) => {
                db.query(
                  `SELECT total_on_shelf FROM Products WHERE id = ?`,
                  [product_id],
                  (err, shelfResults) => {
                    if (err) {
                      return reject(err);
                    }

                    if (shelfResults.length === 0) {
                      req.flash(
                        "error_msg",
                        `Product with id ${product_id} not found`
                      );
                      return res.redirect("/super");
                    }

                    const currentShelfQuantity = shelfResults[0].total_on_shelf;
                    const newQty = currentShelfQuantity - quantity;

                    if (newQty < 0) {
                      req.flash(
                        "error_msg",
                        `Not enough stock for product id ${product_id}`
                      );
                      return res.redirect("/super");

                    }

                    db.query(
                      `UPDATE Products SET ? WHERE id = ?`,
                      [{ total_on_shelf: newQty }, product_id],
                      (error, done) => {
                        if (error) {
                          return reject(error);
                        }
                        resolve(done);
                      }
                    );
                  }
                );
              });
            }
          );

          Promise.all(promises)
            .then(() => {
              db.query(
                `UPDATE Sales SET ? WHERE id = ?`,
                [{ status: "resolved" }, editID],
                (error, result) => {
                  if (error) {
                    req.flash(
                      "error_msg",
                      `Error updating sale status: ${error.sqlMessage}`
                    );
                    return res.redirect("/super");
                  }

                  req.flash("success_msg", "Sale has been resolved");
                  res.redirect("/super/all-sales");
                }
              );
            })
            .catch((error) => {
              console.error(error);
              req.flash(
                "error_msg",
                `Could not resolve the sale: ${error.message}`
              );
              res.redirect("/super");
            });
        }
      );
    }
  );

};





exports.flagProduct = (req, res) => {
  let editID = req.params.id;
  let deactivate = {
    activate: "no",
  };
  db.query(
    `UPDATE inventory SET ? WHERE id = "${editID}" `,
    deactivate,
    (err, results) => {
      if (err) {
        req.flash(
          "error_msg",
          `Error from server Database: ${err.sqlMessage}`
        );
        return res.redirect(`/super/edit-inventory/${editID}`);
      }

      db.query(
        `UPDATE Products SET ? WHERE inventory_id = "${editID}" `,
        deactivate,
        (err, results) => {
          if (err) {
            req.flash(
              "error_msg",
              `Error from server Database: ${err.sqlMessage}`
            );
            return res.redirect(`/`);
          } else {
            req.flash("warning_msg", ` Deactivated successfully!`);
            return res.redirect("/super/all-products");
          }
        }
      );
    }
  );
};

exports.unflagProduct = (req, res) => {
  let editID = req.params.id;
  // create the inventory
  let deactivate = {
    activate: "yes",
  };
  db.query(
    `UPDATE inventory SET ? WHERE id = "${editID}" `,
    deactivate,
    (err, results) => {
      if (err) {
        req.flash(
          "error_msg",
          `Error from server Database: ${err.sqlMessage}`
        );
        return res.redirect(`/super/edit-inventory/${editID}`);
      }

      db.query(
        `UPDATE Products SET ? WHERE inventory_id = "${editID}" `,
        deactivate,
        (err, results) => {
          if (err) {
            req.flash(
              "error_msg",
              `Error from server Database: ${err.sqlMessage}`
            );
            return res.redirect(`/`);
          } else {
            req.flash("success_msg", ` Activated successfully!`);
            return res.redirect("/super/all-products");
          }
        }
      );
    }
  );
};


// showcase functions
exports.addToShowcse = (req, res) => {
  let editID = req.params.id;

  let data = {
    showcase: "yes",
  };
  db.query(
    `UPDATE Products SET ? WHERE id = "${editID}" `,
    data,
    (err, results) => {
      if (err) {
        req.flash(
          "error_msg",
          `Error from server Database: ${err.sqlMessage}`
        );
        return res.redirect(`/super`);
      } else {
        req.flash("success_msg", ` added to showcase successfully!`);
        return res.redirect("/super/all-products");
      }
    }
  );
};
exports.removeFromShowcse = (req, res) => {
  let editID = req.params.id;

  let data = {
    showcase: "no",
  };

      db.query(
        `UPDATE Products SET ? WHERE id = "${editID}" `,
        data,
        (err, results) => {
          if (err) {
            req.flash(
              "error_msg",
              `Error from server Database: ${err.sqlMessage}`
            );
            return res.redirect(`/`);
          } else {
            req.flash("success_msg", ` removed from showcase successfully!`);
            return res.redirect("/super/all-products");
          }
        }
      );
};



// delete req
exports.deleteStore = (req, res) => {
  let editID = req.params.id;

  db.query(`DELETE FROM Stores WHERE id = "${editID}"`, (err, results) => {
    if (err) {
      console.log(err);
      req.flash("error_msg", `could not delete: ${err.sqlMessage}`);
      return res.redirect("/");
    }
    req.flash("success_msg", `${editID} has been removed`);
    return res.redirect("/super/all-stores");
  });
};



exports.deleteDiscount = (req, res) => {
  let editID = req.params.id;

  db.query(`DELETE FROM Discount WHERE id = "${editID}"`, (err, results) => {
    if (err) {
      console.log(err);
      req.flash("error_msg", `could not delete: ${err.sqlMessage}`);
      return res.redirect("/");
    }
    req.flash("success_msg", `${editID} has been removed`);
    return res.redirect("/super/all-discounts");
  });
  return;
};

exports.deleteEmployee = (req, res) => {
  let editID = req.params.id;

  db.query(`DELETE FROM Users WHERE id = "${editID}"`, (err, results) => {
    if (err) {
      console.log(err);
      req.flash("error_msg", `could not delete: ${err.sqlMessage}`);
      return res.redirect("/");
    }
    req.flash("success_msg", `employee has been removed`);
    return res.redirect("/super/all-employees");
  });
};

exports.deleteSupplier = (req, res) => {
  let editID = req.params.id;


  db.query(`DELETE FROM Suppliers WHERE id = "${editID}"`, (err, results) => {
    if (err) {
      console.log(err);
      req.flash("error_msg", `could not delete: ${err.sqlMessage}`);
      return res.redirect("/");
    }
    req.flash("success_msg", `${editID} has been removed`);
    return res.redirect("/super/all-supplier");
  });
};

exports.deleteCategory = (req, res) => {
  let editID = req.params.id;

  // req body
  db.query(
    `DELETE FROM Category WHERE CategoryID = "${editID}"`,
    (err, results) => {
      if (err) {
        console.log(err);
        req.flash("error_msg", `could not delete: ${err.sqlMessage}`);
        return res.redirect("/");
      }
      req.flash("success_msg", `${editID} has been removed`);
      return res.redirect("/super/all-categories");
    }
  );
};

exports.deleteInventory = (req, res) => {
  let editID = req.params.id;
  
console.log(editID);

  db.query(`DELETE FROM inventory WHERE id = "${editID}"`, (err, results) => {
    if (err) {
      req.flash("error_msg", `could not delete: ${err.sqlMessage}`);
      return res.redirect("/");
    }
  });


  db.query( `SELECT * FROM Products WHERE inventory_id = ?`, [editID], (error, results)=>{
    if (error) {
      console.log(error);
      req.flash("error_msg", `could not delete: ${error.sqlMessage}`);
      return res.redirect("/");
    }
    console.log(results);
    if (results.length <= 0) {
      req.flash("success_msg", `${editID} has been removed only from inventory`);
      return res.redirect("/super/all-inventory");
    }
console.log("i got here");

    db.query(`DELETE FROM Products WHERE category_id = "${editID}"`, (err, results) => {
      if (err) {
        req.flash("error_msg", `could not delete: ${err.sqlMessage}`);
        return res.redirect("/");
      }
      req.flash("success_msg", `${editID} has been removed from inventory and store`);
      return res.redirect("/super/all-inventory");
    });
  })

};

exports.deletePosition = (req, res) => {
  let editID = req.params.id;

  // req body
  db.query(`DELETE FROM Positions WHERE id = "${editID}"`, (err, results) => {
    if (err) {
      console.log(err);
      req.flash("error_msg", `could not delete: ${err.sqlMessage}`);
      return res.redirect("/");
    }
    req.flash("success_msg", `${editID} has been removed`);
    return res.redirect("/super/all-positions");
  });
};
exports.deleteLogisticCompany = (req, res) => {
  let editID = req.params.id;

  // req body
  db.query(`DELETE FROM Logistics WHERE id = ? `[editID], (err, results) => {
    if (err) {
      console.log(err);
      req.flash("error_msg", `could not delete: ${err.sqlMessage}`);
      return res.redirect("/");
    }
    req.flash("success_msg", `${editID} has been removed`);
    return res.redirect("/super/all-logistic-company");
  });
};

// orders
// view order
exports.getSingleOrder = (req, res) => {
  let editID = req.params.id;
  const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;

  db.query(
    `SELECT * FROM Orders WHERE  id = '${editID}' `,
    (err, results) => {
      if (err) {
        console.log(err);
        req.flash("error_msg", `could not delete:`);
        return res.redirect("/employee");
      }
      if (results.length <= 0) {
        req.flash("error_msg", `no item  found with  id`);
        return res.redirect("/super");
      }

      let order = JSON.stringify(results);
      let orderData = JSON.parse(order);

      let saleID = orderData[0].sale_id;

      db.query(
        `SELECT * FROM Order_Products  WHERE sale_id = "${saleID}"`,
        (err, results) => {
          if (err) {
            console.log(err);
            req.flash("error_msg", `error from db: ${err.sqlMessage}`);
            return res.redirect("/super");
          }
          let data = JSON.stringify(results);
          let productBought = JSON.parse(data);

          // to get list of all employees
          db.query(
            `SELECT * FROM Logistics`,
            (err, results) => {
              if (err) {
                console.log(err.sqlMessage);
                req.flash("error_msg", `${err.sqlMessage}`);
                return res.redirect("/super");
              }

              // check if item exist
              if (results.length <= 0) {
                console.log("employee is empty");
                req.flash(
                  "error_msg",
                  `Cannot SHIP when LOGISTICS WOKERS is empty`
                );
                res.redirect(`/super`);
                return;
              }

              let logisticsDrivers = JSON.parse(JSON.stringify(results));

              return res.render("./super/orderSingle", {
                pageTitle: "Edit Roles",
                name: `${userFirstName} ${userLastName}`,
                month: monthName,
                day: dayName,
                date: presentDay,
                year: presentYear,
                logisticsDrivers,
                orderData,
                productBought,
              });
            }
          ); //position
        }
      );
    }
  );
};

// confirm for shipping
exports.confirmOrder = (req, res) => {
  let editID = req.params.id;


  // return console.log(editID);
  db.query(`SELECT * FROM Orders WHERE id ="${editID}"`, (err, results) => {
    if (err) {
      req.flash("error_msg", `error from db: ${err.sqlMessage}`);
      return res.redirect("/super");
    }

    if (results.length <= 0) {
      req.flash(
        "error_msg",
        `no record found for that  order`
      );
      return res.redirect("/super");
    }

    if (results[0].status == "canceled") {
      req.flash("error_msg",`order status is "canceled"`);
      return res.redirect("/super/all-orders");
    }

    let data = JSON.stringify(results);
    let thatOrder = JSON.parse(data);
    const saleID = thatOrder[0].sale_id;
    const customerId = thatOrder[0].customer_id;
    const thatOrderTotalAmount = thatOrder[0].total_amount;
    const thatOrderTotalShippingFee = thatOrder[0].shipping_fee;

    let totalSpentOnThisOrder= thatOrderTotalShippingFee + thatOrderTotalAmount




    // ensure its not confirmed yet

    if (thatOrder[0].status == "incomplete") {
      db.query(
        `SELECT * FROM Sales WHERE sale_id = "${saleID}"`,
        (err, results) => {
          if (err) {
            req.flash("error_msg", `error from: ${err.sqlMessage}`);
            return res.redirect("/super");
          }

          let data = JSON.stringify(results);
          let saleData = JSON.parse(data);

          if (saleData.length > 0) {
            req.flash("warning_msg", `this order has already een confrimed`);
            return res.redirect("/super/all-orders");
          }

          // if item does not exist in sales
          // add to sales and update the ordered products

          db.query(
            `INSERT INTO Sales SET ? `,
            {
              store_name: null,
              store_id: null,
              sale_type: "order",
              sale_id: saleID,
              created_date: sqlDate,
              Discount_applied: 0,
              attendant_id: 0,
              total_amount: thatOrder[0].total_amount,
              Payment_type: thatOrder[0].payment_type,
              shipping_fee: thatOrder[0].shipping_fee,
              status: "waiting",
            },
            (err, results) => {
              if (err) {
                req.flash("error_msg", `error from ${err.sqlMessage}`);
                return res.redirect("/super");
              }

              db.query(
                `UPDATE Order_Products  SET ? WHERE sale_id = "${saleID}" AND status ="pending"`,
                {
                  status: "waiting",
                },
                (err, results) => {
                  if (err) {
                    console.log(err);
                    req.flash(
                      "error_msg",
                      `error form db: ${err.sqlMessage}`
                    );
                    return res.redirect("/super");
                  } else {
                    db.query(
                      `UPDATE Orders  SET ? WHERE id = "${editID}"`,
                      {
                        status: "waiting",
                      },
                      (err, results) => {
                        if (err) {
                          console.log(err);
                          req.flash(
                            "error_msg",
                            `error form db: ${err.sqlMessage}`
                          );
                          return res.redirect("/super");
                        }

                        db.query(`SELECT * FROM  Users WHERE id = ?`, [customerId], (error,results)=>{
                          if (error) {
                            console.log(error);
                            req.flash('error_msg', `sql ${error.sqlMessage}`)
                            return res.redirect('/super')
                          }
                          let buyingUser = JSON.parse(JSON.stringify(results[0]))
                          let previousSpending = buyingUser.spending
                          const newUserSpending = previousSpending + totalSpentOnThisOrder

                          db.query(
                            `UPDATE Users SET ? WHERE id = "${customerId}"`,
                            {
                              spending: newUserSpending,
                            },(error, results)=>{
                              if (error) {
                                console.log(error);
                                req.flash('error_msg',`sql ${error.sqlMessage}`)
                               return res.redirect('/super')
                              }
                        // done with all queries
                        req.flash("success_msg",`order has been confirmed! status is set to  waiting (to be resolved)`);
                        return res.redirect(`/super/view-order/${editID}`);
                       
                            }
                          )
                 
                      })// getting user to update total spent 
                       
                      }
                    ); // set  the order  status to waiting to be resolved
                  }
                }
              ); // updateing the orders products to from pending  to sold
            }
          ); // add  to sales table
        }
      ); // to chheck if sales has been added before
    }
    //  ensure not confirmed ends
    else {
      req.flash("warning_msg", `check order status to treat `);
      return res.redirect(`/super/view-order/${editID}`);
    }
  });
};

exports.completeOrder = (req, res) => {
  let editID = req.params.id;

  const driver = req.body.logistics;

  if (!driver) {
    req.flash("warning_msg", `please select a driver`);
    res.redirect(`/super/view-order/${editID}`);
    return;
  }

  db.query(
    `SELECT * FROM Logistics WHERE name = "${driver}"`,
    (err, results) => {
      if (err) {
        req.flash("error_msg", `error from db ${err.sqlMessage}`);
        return res.redirect("/super/all-orders");
      }

      let dispatch = JSON.parse(JSON.stringify(results[0]));

      const dispatchEmail = dispatch.email;
      const dispatchCompanyName = dispatch.name;
      const dispatchPhone = dispatch.phone;
      const dispatchId = dispatch.id;
      db.query(
        `SELECT * FROM Orders WHERE id ="${editID}"`,
        (err, results) => {
          if (err) {
            req.flash("error_msg", `error from db: ${err.sqlMessage}`);
            return res.redirect("/super");
          }

          if (results.length <= 0) {
            req.flash(
              "error_msg",
              `error from db: no record found for that  order`
            );
            return res.redirect("/super");
          }
          let data = JSON.stringify(results);
          let thatOrder = JSON.parse(data);
          const saleID = thatOrder[0].sale_id;

          db.query(
            `UPDATE Sales  SET ? WHERE sale_id = "${saleID}"`,
            {
              status: "unresolved",
            },
            (err, results) => {
              if (err) {
                console.log(err);
                req.flash("error_msg", `error form db: ${err.sqlMessage}`);
                return res.redirect("/super");
              }

              db.query(
                `UPDATE Order_Products  SET ? WHERE sale_id = "${saleID}"`,
                {
                  status: "shipped",
                },
                (err, results) => {
                  if (err) {
                    console.log(err);
                    req.flash(
                      "error_msg",
                      `error form db: ${err.sqlMessage}`
                    );
                    return res.redirect("/super");
                  } else {
                    db.query(
                      `UPDATE Orders  SET ? WHERE sale_id = "${saleID}"`,
                      {
                        status: "shipped",
                        driver: dispatchCompanyName,
                        driver_email: dispatchEmail,
                        driver_phone:dispatchPhone,
                        driver_id:dispatchId,
                      },
                      (err, results) => {
                        if (err) {
                          console.log(err);
                          req.flash(
                            "error_msg",
                            `error form db: ${err.sqlMessage}`
                          );
                          return res.redirect("/super");
                        }

                        req.flash(
                          "success_msg",
                          `order has been Shipped! status is set to  shipped (to be recieved then resolved)`
                        );
                        res.redirect(`/super/all-sales`); // to e resolved imidiately
                      }
                    ); // set  the order  status to waiting to be resolved
                  }
                }
              ); //  up[date Order_products to s
            }
          ); // set status od sales to shipped to remove confusion bee
        }
      );
    }
  );
};

exports.updateImage = (req, res) => {
  const uploadId = req.params.id;

  let filename;

  // Setting the image name from the uploaded file
  if (req.file) {
    filename = req.file.filename;
  } else {
    filename = "default.jpg";
  }

    const postData = {
      image: filename,
    };

    // update inventory
   
    db.query(`SELECT * FROM Products WHERE inventory_id = "${uploadId}"`, (err, results)=>{
      if (err) {
        req.flash('error_msg', `error from db : ${err.sqlMessage}`)
        return res.redirect('/super')
      }

      // check store presence 
        if (results.length > 0) {
        return  db.query(
            `UPDATE Products SET ? WHERE inventory_id = ?`,
            [postData, uploadId],
            (err, results) => {
              if (err) {
                if (req.file) {
                  fs.unlinkSync(req.file.path);
                }
                req.flash("error_msg", `An error occurred from the database, try again!`);
                return res.redirect("/");
              }
              db.query(
                `UPDATE inventory SET ? WHERE id = ?`,
                [postData, uploadId],
                (err, results) => {
                  if (err) {
                    if (req.file) {
                      fs.unlinkSync(req.file.path);
                    }
                    req.flash("error_msg", `An error occurred from the database, try again!`);
                    return res.redirect("/");
                  }
          
                  req.flash("success_msg", `Image uploaded successfully!`);
                  return res.redirect(`/super/inventory/${uploadId}`); // Replace with the correct path
                }
              );
          

            }
          );
        }

        db.query(
          `UPDATE inventory SET ? WHERE id = ?`,
          [postData, uploadId],
          (err, results) => {
            if (err) {
              if (req.file) {
                fs.unlinkSync(req.file.path);
              }
              req.flash("error_msg", `An error occurred from the database, try again!`);
              return res.redirect("/");
            }
    
            req.flash("success_msg", `Image uploaded successfully!`);
            return res.redirect(`/super/inventory/${uploadId}`); // Replace with the correct path
          }
        );
    

    })

};


exports.superSale = (req, res) => {
  const userId  = req.session.Users.id;
    
  var metaItems = JSON.parse(req.body.meta);
  var cartItems = JSON.parse(req.body.cart);
  
  // chhecking for empt cart
  if (cartItems.length <= 0) {
    // to make sure we got something in the cart

      req.flash("error_msg", "Cart cannot  be empty");
      res.redirect("/super/create-sales");
      return;

  
  }


  var uuidForEachSale = Date.now() + Math.floor(Math.random() * 1000);

  let insertData = {
    sale_id: uuidForEachSale,
    sale_type:"counter",
    store_id: null, 
    store_name: null, // to be updated later to any given store
    created_date: sqlDate,
    attendant_id: userId,
    Payment_type: metaItems.paymentType,
    total_amount: metaItems.sumTotal,
    shipping_fee:0
  };
  //   insert
  db.query(
    "INSERT INTO Sales SET ? ",
    insertData,
    (error, result) => {
      if (error) {
        req.flash("errror_msg", `error from db ${error.sqlMessage}`);
        res.redirect("/super/create-sales");
        return;
      }
  
      // Define an array to store promises
      const promises = [];
  
      cartItems.forEach((cartItem) => {
        const { id, name, price,  uuid, quantity,image } = cartItem;


        let newPricePerItem = price*quantity
        let productItem = {
          sale_id: uuidForEachSale,
          product_id: id,
          price_per_item: price,
          subTotal: newPricePerItem,
          store_id: null,
          cart_id:uuid,
          name: name,
          quantity:quantity,
          image:image,
        };
  
        // Push the promise into the array
        promises.push(
          new Promise((resolve, reject) => {
            // Step 3: Insert or retrieve product record from Products table
            db.query(
              "INSERT INTO Order_Products SET ?",
              productItem,
              async (error, result) => {
                if (error) {
                  req.flash("error_msg", `${error.sqlMessage}`)
                  res.redirect('/super/create-sales')
                  return;
                }
  
                // Resolve the promise
                resolve(result);
              }
            );
          })
        );
      });
  
      // Wait for all promises to resolve
      Promise.all(promises)
        .then(() => {
          req.flash(
            "success_msg",
            `Cart has been submitted, Your order reference number is: ${uuidForEachSale}`
          );
          return res.redirect(`/super/invoice/${uuidForEachSale}`)
        })
        .catch((error) => {
          req.flash('error_msg', `error occured: ${error}`)
          return res.redirect('/super/create-sales')
        });
    }
  );
}
