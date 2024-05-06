const express = require('express');
const router = express.Router();
const stateData = require("../model/stateAndLGA");
const db = require("../model/databaseTable");

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const { newCategory } = require('../controllers/adminController');


// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('login',{
  pageTitle:"Login To continue Using Store Keeper"
  }));


  // Route to fetch LGAs for a selected state
router.get("/getlgas/:state", ensureAuthenticated, (req, res) => {

  const { state } = req.params;
  const selectedState = stateData.find((s) => s.state === state);


  if (selectedState) {
    res.json(selectedState.lgas);
  } else {
    res.status(404).json({ error: "State not found" });
  }
});


router.get("/getItems/:id", ensureAuthenticated, async (req, res) => {

  const { id } = req.params;

  db.query(`SELECT * FROM Category WHERE Category_name = "${id}"`, (err, results)=>{
    if (err) {
        req.flash("error_msg", ` ${err.sqlMessage}`)
       return res.redirect('/admin')
    }else{

        let data = JSON.stringify(results);
        let categoryData = JSON.parse(data);


        // select from products
        db.query(`SELECT * FROM Products WHERE category = '${id}' `, (err, results)=>{
          if (err) {
            console.log(err.sqlMessage);
              req.flash("error_msg", ` ${err.sqlMessage}`)
             return res.redirect('/admin')
          }else{

            if (results.length  <= 0) {
              return res.json('')
             }

            let data = JSON.stringify(results);
            let allProducts = JSON.parse(data);

      // prepare payload
        return  res.json(allProducts)
          }
        
        })
    }
  })



 



});
  // logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});



  module.exports = router;