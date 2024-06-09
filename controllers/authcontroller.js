// const bcrypt = require('bcryptjs');

const databaseConnection = require("../model/databaseTable");
let db = databaseConnection;

const systemCalander = new Date().toLocaleDateString();
const yearModel = require("../model/getYear");
let presentYear = yearModel(systemCalander, "/");

const monthModel = require("../model/getMonth");
let presentMonth = monthModel(systemCalander, "/");

const getDay = require("../model/getDay");
let presentDay = getDay(systemCalander, "/");
let sqlDate = presentYear + "-" + presentMonth + "-" + presentDay;





exports.loginHandler = (req, res) => {
  let session = req.session;
  let { email, password } = req.body;

  if (!(email && password)) {
    return res.render("login", { 
      error_msg: "please enter fields",
      pageTitle: "Login To continue Using Store Keeper",
    });
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
        
        session.Users = Users[0];

          req.flash("success_msg", `welcome ${session.Users.First_name}`);
         return res.redirect("/handler");


      }


    }
  );
};

// const lastseen = new Date().toISOString().slice(0, 19).replace('T', ' ');


exports.registerHandler = (req, res) => {
  let errors = [];

  let { phone, email, password, confirm_password, first_name, last_name} = req.body;
  
  // Check if all fields are filled
  if (!(phone && email && password && confirm_password && first_name && last_name  )) {
    errors.push({msg: "enter all details"})
  }
  
  // Check if passwords match
  if (password !== confirm_password) {
    errors.push({msg: "password do not match"})
  }
  
  // Validate password strength
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  if (!passwordRegex.test(password)) {
    errors.push({msg: "Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, and one number."})
  }
  
  // Query the database for existing email
  db.query("SELECT * FROM Users WHERE email = ?", [email], (error, results) => {
    if (error) {
      errors.push({msg: "error from the database"})
    }
    
    if (results.length > 0) {
      errors.push({msg: `User with this email: ${email} already exists.`})
    }

    if (errors.length > 0) {
      return res.render("register", {
        pageTitle:"register again",
        errors,
        phone, email, password, first_name, last_name
    });
    }

    // gather data to add
    const newUser = {
      First_name: first_name,
      Last_name: last_name,
      email: email,
      Phone: phone,
      Password:password,
      created_date: sqlDate,
      Previous_visit: sqlDate,
      spending: 0,
    };
    

    db.query("INSERT INTO Users SET ?", newUser, (error, results) => {
      if (error) {
        req.flash("error_msg", `Database error: ${error.sqlMessage}`);
        return res.redirect("/register");
      }

      req.flash("success_msg", `"${email}" successfully registered!`);
      return res.redirect("/");
    });
  });
};
