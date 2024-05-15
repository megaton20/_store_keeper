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
const { parse } = require("dotenv");
let presentDay = getDay(systemCalander, "/");

let sqlDate = presentYear + "-" + presentMonth + "-" + presentDay;

exports.cartForm = (req, res) => {

  let employeeEmail = req.session.Users.email;
  let userRole  = req.session.Users.userRole;
  let userId  = req.session.Users.id;

 const storeId =   req.session.Users.store_id;
  const storeName = req.session.Users.store_name
  // return

  console.log(storeId);

  var metaItems = JSON.parse(req.body.meta);
  var cartItems = JSON.parse(req.body.cart);

  let productName, price, uuid, unknownStore;

  if (cartItems.length <= 0) {
  // to make sure we got something in the cart
  if (userRole == "admin") {
      req.flash("error_msg", "Cart cannot  be empty");
      res.redirect("/employee/create-sales");
      return;
    
  }else if(userRole == "super"){
    req.flash("error_msg", "Cart cannot  be empty");
    res.redirect("/super/create-sales");
    return;
  }
}else if (userRole == "user"){
  // its a user
  req.flash("error_msg", "Cart cannot  be empty");
  res.redirect("/user/create-sales");
  return;
}
var uuidForEachSale = Date.now() + Math.floor(Math.random() * 1000);

if (userRole == "super"){
  

  let insertData = {
      sale_id: uuidForEachSale,
      store_id: null, 
      store_name: null, // to be updated later to any given store
      created_date: sqlDate,
      attendant_id: userId,
      Payment_type: metaItems.paymentType,
      total_amount: metaItems.sumTotal,
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
          const { id, name, price } = cartItem;

          let productItem = {
            sale_id: uuidForEachSale,
            product_id: id,
            price_per_item: price,
            store_id: null,
            name: name,
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
              `Cart has been submitted, click here to print receipt.`
            );
            res.redirect("/super/create-sales");
          })
          .catch((error) => {
            req.flash('error_msg', `error occured: ${error}`)
            return res.redirect('/super/create-sales')
          });
      }
    );
} else  if (userRole == "admin"){

      let insertData = {
        sale_id: uuidForEachSale,
        store_id: storeId,
        store_name: storeName,
        created_date: sqlDate,
        attendant_id: userId,
        Payment_type: metaItems.paymentType,
        total_amount: metaItems.sumTotal,
      };

      db.query(
        "INSERT INTO Sales SET ? ",
        insertData,
        (error, result) => {
          if (error) {
            req.flash("errror_msg", `error from db ${error.sqlMessage}`);
            res.redirect("/employee/create-sales");
            return;
          }

          // Define an array to store promises
          const promises = [];

          cartItems.forEach((cartItem) => {
            const { id, name, price } = cartItem;

            let productItem = {
              sale_id: uuidForEachSale,
              product_id: id,
              price_per_item: price,
              store_id: storeId,
              name: name,
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
                      req.flash('error_msg', `error occured: ${error}`)
                      return res.redirect('/employee/create-sales')
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
                `Cart has been submitted, click here to print receipt.`
              );
              res.redirect("/employee/create-sales");
            })
            .catch((error) => {
              req.flash('error_msg', `error occured: ${error}`)
              return res.redirect('/employee/create-sales')
            });
        }
      );

} else if (userRole == "user"){
  return console.log("still in construction");
}

};
