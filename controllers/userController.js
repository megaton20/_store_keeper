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
exports.dashbboard = (req, res) => {

  console.log("hi");
  let employeeEmail = req.session.Users.email;
  let userRole  = req.session.Users.userRole;
  let userId  = req.session.Users.id;

 const storeId =   req.session.Users.store_id;
  const storeName = req.session.Users.store_name
  // return




};




// shopping window
exports.counterForm = (req, res) => {
  const sessionEmail = req.session.Users.email;
  const sessionRole = req.session.Users.userRole;
    const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;


  db.query(`SELECT * FROM Cart `, (err, results) => {
    if (err) {
      req.flash("error_msg", ` ${err.sqlMessage}`);
      return res.redirect("/user");
    } else {
      let data = JSON.stringify(results);
      let presentCart = JSON.parse(data);
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
          presentCart
        }); // for admin only
        // not user
      }
    });
    }
  })
};

exports.fetchCart = async (req, res) => {
  const userId = req.session.Users.id; // Assuming req.session.Users.id contains the user's ID from the session
  const userEmail =  req.session.Users.email; // Assuming req.user.email contains the user's email from the authentication data

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

    // Assuming you have a view named 'cart' to render the fetched cart items
    res.render('./user/cart', { 
      cartItems: results,
      pageTitle:"check out",
      totalSubtotal,
      shippingFee,
      totalSum: shippingFee + totalSubtotal
     });
  });
}

// cart sending for order
exports.submitCart = (req, res) => {

  const orderRequestEmail = req.params.email
  const email = req.session.Users.email;
  const userRole  = req.session.Users.userRole;
  const userId  = req.session.Users.id;

 const storeId =   req.session.Users.store_id;
  const storeName = req.session.Users.store_name
  // return

  // chhecking for empt cart
  if (orderRequestEmail !== email) {
  // to make sure we got something in the cart
    req.flash("error_msg", "unknown order from unkonw user");
    res.redirect("/user");
    return;
}

// creatting new sale actions
const uuidForEachSale = Date.now() + Math.floor(Math.random() * 1000);

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
  customer_phone:req.session.Users.Phone,
  customer_address: req.session.Users.Address,
  customer_state:req.session.Users.state,
  customer_lga:req.session.Users.lga,
  pick_up_store_id: storeId, 
  pick_up_store_name :storeName, // to be updated later to any given store
  sale_id: uuidForEachSale,
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

}


// invoice of an order
exports.invoice = (req, res) => {
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