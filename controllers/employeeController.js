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

  
  let userFirstName = req.session.Users.First_name;
  let userLastName = req.session.Users.Last_name;

    db.query(`SELECT * FROM Category `, (err, results) => {
      if (err) {
        req.flash("error_msg", ` ${err.sqlMessage}`);
        return res.redirect("/");
      } else {
        let data = JSON.stringify(results);
        let allCategory = JSON.parse(data);

         return res.render("./employee/adminDash", {
            pageTitle: "Employee dasdoard",
            name: `${userFirstName} ${userLastName}`,
            month: monthName,
            day: dayName,
            date: presentDay,
            year: presentYear,
            allCategory,
          }); // for admin only
          
      }
    });
};

//  at the counter page
exports.counterForm = (req, res) => {
  const sessionEmail = req.session.Users.email;
    const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_name;
// return console.log(req.session.User

    return db.query(`SELECT * FROM Category `, (err, results) => {
      if (err) {
        req.flash("error_msg", ` ${err.sqlMessage}`);
        return res.redirect("/");
      } else {
        let data = JSON.stringify(results);
        let allCategory = JSON.parse(data);

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
    });
   

};

exports.invoice = (req, res) => {
  const saleId  = req.params.id
    const userFirstName = req.session.Users.First_name;
  const userLastName = req.session.Users.Last_nam




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
  
          return res.render("./employee/saleInvoice", {
            pageTitle: "invoice",
            name: `${userFirstName} ${userLastName}`,
            month: monthName,
            day: dayName,
            date: presentDay,
            year: presentYear,
            newSale,
            newOrderProducts,
          }); // for admin only
          // not user
        }
      });
    }
  }) // products ordered

   
};