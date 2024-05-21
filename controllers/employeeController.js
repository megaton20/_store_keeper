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

  const sessionEmail = req.session.Users.email;
  const sessionRole = req.session.Users.userRole;

  let userFirstName = req.session.Users.First_name;
  let userLastName = req.session.Users.Last_name;




  if (!sessionEmail) {
    req.flash("error_msg", "No session, you are required to log in");
    res.redirect("/");
    return;
  }

  if (sessionRole == "admin") {
    db.query(`SELECT * FROM Category `, (err, results) => {
      if (err) {
        req.flash("error_msg", ` ${err.sqlMessage}`);
        return res.redirect("/");
      } else {
        let data = JSON.stringify(results);
        let allCategory = JSON.parse(data);

        if (sessionRole == "admin") {
         return res.render("./employee/adminDash", {
            pageTitle: "At the counter",
            name: `${userFirstName} ${userLastName}`,
            month: monthName,
            day: dayName,
            date: presentDay,
            year: presentYear,
            allCategory,
          }); // for admin only
          
        } 
      }
    });
  } else if(sessionRole == "super"){
        // not amin
        req.flash('warning_msg', `the entry  pattern was for admins only`)
       return res.redirect("/super")
  }else if (sessionRole == 'user') {
       // not amin
       req.flash('warning_msg', `the entry  pattern was for admins only`)
       return res.redirect("/user")
  }


};

//  at the counter page
exports.counterForm = (req, res) => {
  const sessionEmail = req.session.Users.email;
  const sessionRole = req.session.Users.userRole;
    const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;

  if (!sessionEmail) {
    req.flash("error_msg", "No session, you are required to log in");
    res.redirect("/");
    return;
  }

  if (sessionRole == "admin") {
    // to get total sales made
     // other quwries
     db.query(`SELECT * FROM Category `, (err, results) => {
      if (err) {
        req.flash("error_msg", ` ${err.sqlMessage}`);
        return res.redirect("/");
      } else {
        let data = JSON.stringify(results);
        let allCategory = JSON.parse(data);

        if (sessionRole == "admin") {
          return res.render("./employee/employeeCounter", {
            pageTitle: "At the counter",
            name: `${userFirstName} ${userLastName}`,
            month: monthName,
            day: dayName,
            date: presentDay,
            year: presentYear,
            allCategory,
          }); // for admin only
          
        } 
        // not amin
        req.flash('warning_msg', `the entry  pattern is for admins only`)
        res.redirect("/admin")
      }
    });
   
  } 
};




// delivery
exports.allPendingDelivery = (req, res)=>{

  const sessionEmail = req.session.Users.email;
  const sessionRole = req.session.Users.userRole;
    const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;

  if (sessionRole == "admin") {
  db.query(`SELECT * FROM Orders WHERE driver_email = "${sessionEmail}" AND status = "shipped" `, (err, results) => {
    if (err) {
      req.flash("error_msg", ` ${err.sqlMessage}`);
      return res.redirect("/");
    } else {
      let data = JSON.stringify(results);
      let pendingDelivery = JSON.parse(data);

       return res.render("./employee/employeeDeliveryTable", {
          pageTitle: "delivery to maked",
          name: `${userFirstName} ${userLastName}`,
          month: monthName,
          day: dayName,
          date: presentDay,
          year: presentYear,
          pendingDelivery,
        }); // for admin only
        
      }
    });
  } else if (sessionRole == "super") {
    
    req.flash('error_msg', `you are not ready to use this feature yet`)
    res.redirect('/super')
    return
  }else if (sessionRole == "user") {
    req.flash('error_msg', `you can't handle your own delivery ogaaaa`)
    res.redirect('/user')
    return
  }
}
exports.oneDelivery = (req, res)=>{
  let editId = req.params.id

  const sessionEmail = req.session.Users.email;
  const sessionRole = req.session.Users.userRole;
    const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;

  if (sessionRole == "admin") {
  db.query(`SELECT * FROM Orders WHERE  id = "${editId}" `, (err, results) => {
    if (err) {
      req.flash("error_msg", ` ${err.sqlMessage}`);
      return res.redirect("/");
    } else {
      let data = JSON.stringify(results);
      let orderToComplete = JSON.parse(data);

      let itemId = orderToComplete[0].sale_id

      db.query(`SELECT * FROM Order_Products WHERE  sale_id = "${itemId}" `, (err, results) => {
        if (err) {
          console.log(err);
          req.flash("error_msg", `error from db ${err}`)
          return res.redirect("/employee")
        }
        let data = JSON.stringify(results);
        let orderedProducts = JSON.parse(data);

        return res.render("./employee/employeeDeliveryDetails", {
          pageTitle: "delivery to maked",
          name: `${userFirstName} ${userLastName}`,
          month: monthName,
          day: dayName,
          date: presentDay,
          year: presentYear,
          orderedProducts,
          orderToComplete,
        }); // for admin only
      })// to get the products ordered
    
      }
    }); // to get the pending item
  } else if (sessionRole == "super") {
    
    req.flash('error_msg', `you are not ready to use this feature yet`)
    res.redirect('/super')
    return
  }else if (sessionRole == "user") {
    req.flash('error_msg', `you can't handle your own delivery ogaaaa`)
    res.redirect('/user')
    return
  }
}
exports.finishDelivery = (req, res)=>{
  let editId = req.params.id
  const sessionEmail = req.session.Users.email;
  const sessionRole = req.session.Users.userRole;
    const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;

  // turn sale item to unresolved
  // chhange order_products to shhipped
  // change order to complete

  
  if (sessionRole == "admin") {
    db.query(`SELECT * FROM Order_Products WHERE  id = "${editId}" `, (err, results) => {
      if (err) {
        req.flash("error_msg", ` ${err.sqlMessage}`);
        return res.redirect("/");
      } else {
        let data = JSON.stringify(results);
        let orderToComplete = JSON.parse(data);
        
        let itemId = orderToComplete[0].sale_id
        
        
        db.query(`UPDATE Orders SET ? WHERE  sale_id = "${itemId}" `, {
          status: 'complete'
        },(err, results) => {
          
          if(err){
            console.log(err);
            req.flash('error_msg', `error whhile updating ${err}`)
            return res.redirect("/employee")
          }

          db.query(`UPDATE  Order_Products SET ? WHERE  sale_id = "${itemId}" `, {
            status: 'sold'
          },(err, results) => {
            if (err) {
              req.flash("error_msg", `error from db ${err}`)
              return res.redirect("/employee")
            }  
            req.flash("success_msg", `order has been marked as completed`)
            return res.redirect('/employee/all-deliveries')
          })// to complete the products ordered
        }) // update  order to conplete


      
        }
      }); // to get the pending item
    } else if (sessionRole == "super") {
      
      req.flash('error_msg', `you are not ready to use this feature yet`)
      res.redirect('/super')
      return
    }else if (sessionRole == "user") {
      req.flash('error_msg', `you can't handle your own delivery ogaaaa`)
      res.redirect('/user')
      return
    }
}