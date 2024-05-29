const express = require('express');
const router = express.Router();
const stateData = require("../model/stateAndLGA");
const db = require("../model/databaseTable");

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const { newCategory } = require('../controllers/superController');


// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('login',{
  pageTitle:"Login To continue Using Store Keeper"
  }));
  router.get('/register', forwardAuthenticated, (req, res) => res.render('register',{
    pageTitle:"Login To continue Using Store Keeper",
    stateData
    }));

  // Route to fetch LGAs for a selected state
router.get("/getlgas/:state", (req, res) => {

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
  const { search } = req.query;


  let query = `SELECT * FROM Products WHERE activate = "yes" AND total_on_shelf > 0 AND status = "not-expired"`;

  if (id !== 'all') {
    query += ` AND category = '${id}'`;
  }

  if (search) {
    query += ` AND ProductName LIKE '%${search}%'`;
  }

  db.query(query, (err, results) => {
    if (err) {
      console.log(err.sqlMessage);
      req.flash("error_msg", `${err.sqlMessage}`);
      return res.redirect('/admin');
    } else {
      if (results.length <= 0) {
        return res.json([]);
      }

      let data = JSON.stringify(results);
      let allProducts = JSON.parse(data);

      return res.json(allProducts);
    }
  });
});



router.post('/updateCart', ensureAuthenticated, async (req, res) => {
  const userId = req.session.Users.id; // Assuming req.session.Users contains the authenticated user's info
  const userEmail = req.session.Users.email; // Assuming the user's email is stored in session

  
  // Clear existing cart items for the user
  const clearCartQuery = `DELETE FROM Cart WHERE user_id = ?`;

  db.query(clearCartQuery, [userId], (err) => {
    if (err) {
      console.error(err);
      req.flash('error_msg', 'Failed to clear existing cart');
      return res.status(500).json({ error: 'Failed to clear existing cart' });
    }

    // Insert new cart items
    const insertCartQuery = `INSERT INTO Cart (user_id, user_email, product_id, quantity, product_name, price_per_item, subtotal, uuid, image) VALUES ?`;
    const cartValues = req.body.cart.map(item => [

      userId,
      userEmail,
      item.id,
      item.quantity,
      item.name,
      item.price,
      (item.price * item.quantity),
      item.uuid,
      item.image
    ]);

    if (cartValues.length === 0) {
      req.flash('success_msg', 'Cart updated successfully');
      return res.status(200).json({ message: 'Cart updated successfully' });
    }

    db.query(insertCartQuery, [cartValues], (err) => {
      if (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to update cart');
        return res.status(500).json({ error: 'Failed to update cart' });
      }

      req.flash('success_msg', 'Cart updated successfully');
      res.status(200).json({ message: 'Cart updated successfully' });
    });
  });
});



// Example of a protected POST route
router.post('/updateCartItem', ensureAuthenticated, (req, res) => {
    const userId = req.session.Users.id;
    const userEmail = req.session.Users.email;
    const { productId, change } = req.body;

    const getItemQuery = `
        SELECT * FROM Cart WHERE user_id = ? AND user_email = ? AND product_id = ?
    `;

    db.query(getItemQuery, [userId, userEmail, productId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Failed to fetch cart item' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Cart item not found' });
        }

        const item = results[0];
        const newQuantity = item.quantity + change;

        if (newQuantity <= 0) {
            const deleteItemQuery = `DELETE FROM Cart WHERE id = ?`;
            db.query(deleteItemQuery, [item.id], (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ success: false, message: 'Failed to delete cart item' });
                }
                return res.json({ success: true });
            });
        } else {
            const updateItemQuery = `
                UPDATE Cart 
                SET quantity = ?, subtotal = price_per_item * ? 
                WHERE id = ?
            `;
            db.query(updateItemQuery, [newQuantity, newQuantity, item.id], (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ success: false, message: 'Failed to update cart item' });
                }
                return res.json({ success: true });
            });
        }
    });
});

module.exports = router;





  // logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});



  module.exports = router;