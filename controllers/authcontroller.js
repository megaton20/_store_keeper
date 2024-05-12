
// const bcrypt = require('bcryptjs');

const databaseConnection = require("../model/databaseTable");
let db = databaseConnection;




exports.loginHandler = (req, res) => {

  let session = req.session
  let { email, password } = req.body;

  if (!(email && password)) {
    return res.render("login", { error_msg: "please enter fields" });
  }
  
  // quey db for existinf email
  db.query('SELECT * FROM Employees WHERE email = ?', [email],  (error, results) =>{
    
    if (error) {
      req.flash("error_msg", "Error from server Database, try again")
      return res.redirect("/"); 
    }
    
    var resultAsString = JSON.stringify(results);
    var employees = JSON.parse(resultAsString);
    
    
    if (employees.length <= 0) {
      return res.render('login', {error_msg: "email does not", 
      pageTitle:"Login To continue Using Store Keeper"
    })
    }else if (employees[0].password != password) {
      return res.render('login', {
        error_msg: "incorrect email or password",
        pageTitle:"Login To continue Using Store Keeper"
      })
    } else {
      let role = employees[0].userRole
      if (role = 'super') {
        session.employees = employees[0];
        req.flash('success_msg',  `welcome ${session.employees.First_name}`)
        res.redirect('/admin')
        
      } else {
        console.log("not supa");
        
      }
    }
  
  // comparing the password with the hashed password
  //    await bcrypt.compare(password, results[0].password, (error, response) =>{
  //         if(response) {
  //             // creating a session cookie for the user
  
  //             res.send(`${userName} loged in as admin`)
  //             }else{
  //                 console.log(error)
  //                 return console.log("wrong credentials");
  //             }
  //     });

  })
  
};


