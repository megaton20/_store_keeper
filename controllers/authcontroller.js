// const bcrypt = require('bcryptjs');

const databaseConnection = require("../model/databaseTable");
let db = databaseConnection;

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

exports.loginHandler = (req, res) => {
  let session = req.session;
  let { email, password } = req.body;

  if (!(email && password)) {
    return res.render("login", { error_msg: "please enter fields" });
  }

  // quey db for existinf email
  db.query(
    "SELECT * FROM Users WHERE email = ?",
    [email],
    (error, results) => {
      if (error) {
        req.flash("error_msg", `Error from server ${error.sqlMessage}, try again`);
        return res.redirect("/");
      }

      var resultAsString = JSON.stringify(results);
      var Users = JSON.parse(resultAsString);

      if (Users.length <= 0) {
        return res.render("login", {
          error_msg: "email does not",
          pageTitle: "Login To continue Using Store Keeper",
        });
      } else if (Users[0].Password != password) {
        return res.render("login", {
          error_msg: "incorrect email or password",
          pageTitle: "Login To continue Using Store Keeper",
        });
      } else {
        let role = Users[0].userRole;
        session.Users = Users[0];



        if ((role == "super")) {
          req.flash("success_msg", `welcome ${session.Users.First_name}`);
         return res.redirect("/super");

        } else if (role == "admin") {
          
          req.flash("success_msg", `welcome ${session.Users.First_name}`);
         return res.redirect("/employee");
        } else if(role == "user"){
          req.flash("success_msg", `welcome ${session.Users.First_name}`);
         return res.redirect("/user");
        }
      }


    }
  );
};

exports.registerHandler = (req, res) => {
  let { phone, email, password, confirm_password, first_name, last_name } =
    req.body;

  if (
    !(
      email &&
      password &&
      phone &&
      email &&
      password &&
      confirm_password &&
      first_name &&
      last_name
    )
  ) {
    return res.render("register", {
      error_msg: "please enter fields",
      pageTitle: "Register here",
    });
  }

  // quey db for existinf email
  db.query(
    "SELECT * FROM Customers WHERE email = ?",
    [email],
    (error, results) => {
      if (error) {
        req.flash("error_msg", `Error Database ${error.sqlMessage}`);
        return res.redirect("/register");
      }

      var resultAsString = JSON.stringify(results);
      var customer = JSON.parse(resultAsString);

      if (results.length > 0) {
        return res.render("register", {
          error_msg: `User with this email: ${email} already exist`,
          pageTitle: "Register here",
        });
      }
        // do this
        db.query("INSERT INTO Customers SET ?", {
          First_name: first_name,
          Last_name: last_name,
          email: email,
          Phone: phone,
          created_date: sqlDate,
          Previous_visit: sqlDate,
          spending: 0,
        });

        req.flash("success_msg", `"${email}" successfully registered!`);
        return res.redirect("/");

    }
  );
};
