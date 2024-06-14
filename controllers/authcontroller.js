
const bcrypt = require('bcrypt');
const { promisify } = require('util');
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






// Convert db.query to return a promise
const query = promisify(db.query).bind(db);

exports.loginHandler = async (req, res) => {
  let session = req.session;
  let { email, password } = req.body;

  if (!(email && password)) {
    return res.render("login", { 
      error_msg: "Please enter fields",
      pageTitle: "Login To continue Using Store Keeper",
    });
  }

  try {
    // Query db for existing email
    const results = await query("SELECT * FROM Users WHERE email = ?", [email]);

    if (results.length === 0) {
      return res.render("login", {
        error_msg: "Email does not exist",
        pageTitle: "Login To continue Using our Store",
      });
    }

    const Users = results[0];
    
    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, Users.Password);

    if (!isMatch) {
      return res.render("login", {
        error_msg: "Incorrect email or password",
        pageTitle: "Login To continue Using our Store ",
      });
    }

    // Successful login
    session.Users = Users;
    req.flash("success_msg", `Welcome ${session.Users.First_name}`);
    return res.redirect("/handler");

  } catch (error) {
    req.flash("error_msg", `Error from server ${error.message}, try again`);
    return res.redirect("/");
  }
};


exports.registerHandler = async (req, res) => {
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

    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
  
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
      Password:hashedPassword,
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
      return res.redirect("/login");
    });
  });
};
