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
  } else {
        // not amin
        req.flash('warning_msg', `the entry  pattern was for admins only`)
       return res.redirect("/super")
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







