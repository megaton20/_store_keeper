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

const shippingFee = 500

//profile for user
exports.profilePage = (req, res) => {

  let employeeEmail = req.session.Users.email;
  let userId  = req.session.Users.id;

db.query(`SELECT * FROM Users WHERE id = ${userId}`, (error, results)=> {
  if (error) {
    console.log(error);
    req.flash('error_msg', 'error from db')
    return res.redirect('/user')
  }

  let userData = JSON.parse(JSON.stringify(results[0]))
  return res.render('./user/userSingleView', {
    pageTitle:`user profile`,
    userData
  })
})
  // return




};

exports.editProfilePage = (req, res) => {

  const updateId = req.params.id

  let employeeEmail = req.session.Users.email;
  let userId  = req.session.Users.id;

db.query(`SELECT * FROM Users WHERE id = ${updateId}`, (error, results)=> {
  if (error) {
    console.log(error);
    req.flash('error_msg', 'error from db')
    return res.redirect('/user')
  }

  let userData = JSON.parse(JSON.stringify(results[0]))
  return res.render('./user/userEditPage', {
    pageTitle:`Edit profile`,
    userData,
    stateData
  })
})
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
    return  db.query(
      `UPDATE Users SET ? WHERE id = ?`,
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
        return res.redirect(`/user/profile/`);
    

      }
    );

};

exports.updateUserInfo = (req, res) => {
  const uploadId = req.params.id;
 let errors = []


  const {First_name,Last_name, gender,Address, land_mark ,state, lga} = req.body

  if (!(state && lga && land_mark && Address && gender && First_name && Last_name  )) {
    errors.push({msg: "enter all details"})
  }

    // Query the database for existing email
    db.query("SELECT * FROM Users WHERE id = ?", [uploadId], (error, results) => {
      if (error) {
        errors.push({msg: "error from the database"})
      }
      if (results.length <= 0) {
        errors.push({msg: `User does not exists.`})
      }
      let userData = JSON.parse(JSON.stringify(results[0]))

      if (errors.length > 0) {
        return res.render('./user/userEditPage', {
          pageTitle:`Edit profile`,
          userData,
          stateData,
          errors,
          First_name,Last_name, gender,Address, land_mark ,state, lga
      })
    }


      const postData = {
        First_name:First_name,
        Last_name:Last_name,
        gender: gender,
        Address:Address,
        land_mark: land_mark ,
        state:state,
        lga:lga,
      };
      return  db.query(
        `UPDATE Users SET ? WHERE id = ?`,
        [postData, uploadId],
        (err, results) => {
          if (err) {
            req.flash("error_msg", `An error occurred from the database, try again!`);
            return res.redirect("/");
          }
  
          req.flash("success_msg", `user uploaded successfully!`);
          return res.redirect(`/user/profile/`);
        }
      );


    })




};

// shopping window
exports.userShop = (req, res) => {

    const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;

  let query = `SELECT * FROM Products WHERE showcase = ? AND total_on_shelf > ? AND status = ?`;
  let queryParams = ['yes', 0, 'not-expired'];
  query += ` ORDER BY RAND() LIMIT 20`;

  // shocase item
  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.log(err.sqlMessage);
      req.flash("error_msg", `${err.sqlMessage}`);
      return res.redirect('/user');
    } else {
      let showcaseItem = JSON.parse( JSON.stringify(results));
      db.query(`UPDATE Users SET ? WHERE id = ?`, [{Previous_visit: sqlDate},req.session.Users.id], (err, results) => {
        if (err) {
          console.log(err);
          req.flash("error_msg", ` ${err.sqlMessage}`);
          return res.redirect("/user");
        }
        db.query(`SELECT * FROM Cart WHERE user_id = ?`, [req.session.Users.id], (err, results) => {
          if (err) {
            req.flash("error_msg", ` ${err.sqlMessage}`);
            return res.redirect("/user");
          } else {
            let presentCart = JSON.parse( JSON.stringify(results));
      
          // other quwries
          db.query(`SELECT * FROM Category `, (err, results) => {
            if (err) {
              req.flash("error_msg", ` ${err.sqlMessage}`);
              return res.redirect("/user");
            } else {
              let data = JSON.stringify(results);
              let allCategory = JSON.parse(data);
      
              return res.render("./user/userCounter", {
                pageTitle: "At the counter",
                name: `${userFirstName} ${userLastName}`,
                month: monthName,
                day: dayName,
                date: presentDay,
                year: presentYear,
                allCategory,
                shippingFee,
                presentCart,
                showcaseItem
              }); // for admin only
              // not user
            }
          });
          }
        })
      })
    }
  });






};

exports.searchPage = (req, res) => {

    const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;

        return res.render("./user/userSearchPage", {
          pageTitle: "Search your item",
          name: `${userFirstName} ${userLastName}`,
          month: monthName,
          day: dayName,
          date: presentDay,
          year: presentYear,
        }); // for admin only
        // not user
};

exports.searchPost = (req, res) => {

  const userFirstName = req.session.Users.First_name;
const userLastName = req.session.Users.Last_name;

req.flash('warning_msg', `we are still working on the general search`)
      return res.render("./user/userSearchPage", {
        pageTitle: "Search your item",
        name: `${userFirstName} ${userLastName}`,
        month: monthName,
        day: dayName,
        date: presentDay,
        year: presentYear,
      }); 
};


exports.fetchCart = async (req, res) => {
  const userId = req.session.Users.id; // Assuming req.session.Users.id contains the user's ID from the session
  const userEmail =  req.session.Users.email; // Assuming req.user.email contains the user's email from the authentication data

  db.query(`SELECT * FROM Users WHERE id = ?`, [userId], (error, results)=> {
    if (error) {
      console.log(error);
      req.flash('error_msg', `error ${error.sqlMessage}`)
      res.redirect('/user')
    }

    let userData = JSON.parse(JSON.stringify(results[0]))

    if (!(userData.Address && userData.state && userData.lga && userData.land_mark)) {
      req.flash("error_msg", "complete your form registrration")
      res.redirect(`/user/edit-user/${userId}`)
      return
    }


  const fetchCartQuery = `
  SELECT * FROM Cart WHERE user_id = ? AND user_email = ?`;

db.query(fetchCartQuery, [userId, userEmail], (err, results) => {
  if (err) {
    req.flash('error_msg', `error from db: ${err.sqlMessage}`);
    return res.redirect('/user')
  }


  if (results.length === 0) {
    req.flash('warning_msg', 'No items in the cart select items to buy');
    return res.redirect('/user')
  }

  const cartItems = results
// Calculate the total subtotal
const totalSubtotal = cartItems.reduce((accumulator, item) => {
return accumulator + item.subtotal;
}, 0);

let customerToPay = shippingFee + totalSubtotal
let formatedCustomerToPay = customerToPay.toLocaleString("en-US");

  // Assuming you have a view named 'cart' to render the fetched cart items
  res.render('./user/cart', { 
    cartItems: results,
    pageTitle:"check out",
    totalSubtotal,
    shippingFee,
    totalSum: formatedCustomerToPay,
    customerToPay,
    userData,
   });
});
  })

}

// cart sending for order
exports.submitCart = (req, res) => {


  const transactionPaymentReference = req.params.reference
  const email = req.session.Users.email;
  const userId  = req.session.Users.id;

 const storeId =   req.session.Users.store_id;
  const storeName = req.session.Users.store_name
  // return

  // chhecking for empt cart

// creatting new sale actions
const uuidForEachSale = Date.now() + Math.floor(Math.random() * 1000);

db.query(`SELECT * FROM Transactions WHERE reference = ?`, [transactionPaymentReference], (err, results)=>{
  if (err) {
    req.flash('error_msg', `sql getting transaction ${err.sqlMessage}`)
    res.redirect('/user')
    return
  }
  const  transactionData = JSON.parse(JSON.stringify(results[0]))
  const  transactionEmail = transactionData.email


  if (email !== transactionEmail) {
    req.flash('error_msg', `email conflict`)
    res.redirect('/user')
    return
  }

  db.query(`SELECT * FROM Users WHERE id = ?`, [userId], (err, results)=>{
    if (err) {
      console.log(err);
      req.flash('error_msg', `sql ${err.sqlMessage}`)
      res.redirect('/user')
      return
    }
    let userData = JSON.parse(JSON.stringify(results[0]))
  
    db.query(`SELECT * FROM Cart WHERE user_id = "${userId}"`, (err, results)=>{
      if (err) {
        req.flash('error_msg', `error from db: ${err.sqlMessage}`)
        return res.redirect('/')
      }
    
    
      // Sample cart items data (replace this with your actual data)
    const cartItems = results
    // Calculate the total subtotal
    const totalSubtotal = cartItems.reduce((accumulator, item) => {
      return accumulator + item.subtotal;
    }, 0);
    
    // Assuming insertData is the data for Orders table
    const insertData = {
      customer_email :email,
      customer_id:userId,
    // query user and get the details
      customer_phone:userData.Phone,
      customer_address: userData.Address,
      customer_state:userData.state,
      customer_lga:userData.lga,
    
      pick_up_store_id: storeId, 
      pick_up_store_name :storeName, // to be updated later to any given store
      sale_id: uuidForEachSale,
      transaction_id:transactionData.id,
      Delivery:"Delivery",
      status:'incomplete',
      Payment_type: "cash",
      created_date: sqlDate,
      total_amount: totalSubtotal ,
      shipping_fee:shippingFee
    };
    
    db.query("INSERT INTO Orders SET ?", insertData, (error, result) => {
      if (error) {
        console.log(error);
        req.flash("error_msg", `error from db ${error.sqlMessage}`);
        res.redirect("/user");
        return;
      }
    
      // Define an array to store promises
      const promises = [];
    
    
      const storeId = 1; // Replace with actual store ID logic
    
      cartItems.forEach((cartItem) => {
        const { id, product_id, price_per_item, quantity, product_name, subtotal, uuid,image } = cartItem;
    
        let productItem = {
          sale_id: uuidForEachSale,
          product_id: product_id,
          price_per_item: price_per_item,
          subTotal: subtotal,
          store_id: storeId,
          cart_id: uuid,
          status: "pending",
          name: product_name,
          quantity: quantity,
          image:image,
        };
    
        // Push the promise into the array
        promises.push(
          new Promise((resolve, reject) => {
            db.query("INSERT INTO Order_Products SET ?", productItem, (error, result) => {
              if (error) {
                console.log(error);
                req.flash('error_msg', `error occurred: ${error}`);
                reject(error);
              } else {
                resolve(result);
              }
            });
          })
        );
      });
    
      // Wait for all promises to resolve
      Promise.all(promises)
        .then(() => {
          db.query(`DELETE FROM Cart WHERE user_id = "${userId}"`, (err, results)=>{
            if (err) {
              console.log(err);
              req.flash('error_msg', `error from db: ${err.sqlMessage}`)
              return res.redirect('/')
            }
    
            req.flash("success_msg", `Cart has been submitted, Your order reference number is: ${uuidForEachSale}`);
            return res.redirect(`/user/invoice/${uuidForEachSale}`);
        })
         
        })
        .catch((error) => {
          req.flash('error_msg', `error occurred: ${error}`);
          res.redirect('/user');
        });
    });
    
    })
  
  })

})





}


// invoice of an order
exports.invoice = (req, res) => {
  const saleId  = req.params.id
    const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;




  db.query(`SELECT * FROM Orders WHERE sale_id = "${saleId}"`, (err, results) => {
    if (err) {
      req.flash("error_msg", ` ${err.sqlMessage}`);
      return res.redirect("/");
    } else {
      let data = JSON.stringify(results);
      let newOrder = JSON.parse(data);


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
  
          return res.render("./user/userInvoice", {
            pageTitle: "invoice",
            name: `${userFirstName} ${userLastName}`,
            month: monthName,
            day: dayName,
            date: presentDay,
            year: presentYear,
            newSale,
            newOrderProducts,
            newOrder,
            totalSum: shippingFee + newOrder[0].total_amount
          }); // for admin only
          // not user
        }
      });
    }
  }) // products ordered
    }
  })// order details




 

   
};

// all orders made my a user
exports.allUserOder = (req, res) => {
  const saleId  = req.params.id
  const sessionEmail = req.session.Users.email;
  const sessionRole = req.session.Users.userRole;
    const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;

  if (!sessionEmail) {
    req.flash("error_msg", "No session, you are required to log in");
    res.redirect("/");
    return;
  }


  db.query(`SELECT * FROM Orders WHERE customer_email = "${sessionEmail}" ORDER BY id DESC LIMIT 5`, (err, results) => {
    if (err) {
      req.flash("error_msg", ` ${err.sqlMessage}`);
      return res.redirect("/");
    } else {
      let data = JSON.stringify(results);
      let newOrder = JSON.parse(data);

      return res.render("./user/userOrders", {
        pageTitle: "orders",
        name: `${userFirstName} ${userLastName}`,
        month: monthName,
        day: dayName,
        date: presentDay,
        year: presentYear,
        newOrder,
      }); 

    }
  })

};


exports.cancelOrder = (req, res) => {
  const saleId  = req.params.id

const updateData = {
  status: "canceled"
}

  db.query(`SELECT * FROM Orders WHERE sale_id = ?`, [saleId], (err, results)=> {
    if (err) {
      console.log(err);
      req.flash('error_msg', `error ${err.sqlMessage}`)
      return res.redirect('/user')
    }

    // check if order exist
    if (results.length <= 0) {
      req.flash('error_msg', `order no dey`)
      return res.redirect('/user')
    }

    const orderStatus = JSON.parse(JSON.stringify(results[0]))
    const transactionId = orderStatus.transaction_id



    // check if order is canceled
    if (orderStatus.status == "canceled") {
      req.flash('error_msg', `error ${saleId} has already been canceled`)
      return res.redirect('/user')
    }

    if (orderStatus.status !== "incomplete") {
      req.flash('error_msg', `error ${saleId} has passed that stage to be canceled`)
      return res.redirect('/user')
    }
    
    // go ahead and update
    db.query(`UPDATE Transactions SET ? WHERE id = ? `,[ {cancel: 'yes'}, transactionId], (err, results) => {
      if (err) {
        req.flash("error_msg", ` ${err.sqlMessage}`);
        return res.redirect("/user");
      } 
      db.query(`UPDATE Orders SET ? WHERE sale_id = ? AND status = 'incomplete'`,[ updateData, saleId], (err, results) => {
        if (err) {
          req.flash("error_msg", ` ${err.sqlMessage}`);
          return res.redirect("/user");
        } else {
          
          db.query(`UPDATE Order_Products SET ? WHERE sale_id = ?`, [updateData,saleId], (err, results) => {
            if (err) {
              req.flash("error_msg", ` ${err.sqlMessage}`);
              return res.redirect("/user");
            } else {
              req.flash('warning_msg', `order canceled succesfully`)
              res.redirect('/user')
              return
            }
          }) // products ordered
        }
      })// order details
    })


  })
   
};