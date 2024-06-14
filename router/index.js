const express = require('express');
const router = express.Router();
const axios = require('axios');
const crypto = require('crypto');

const stateData = require("../model/stateAndLGA");
const db = require("../model/databaseTable");

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const { newCategory } = require('../controllers/superController');
const { log } = require('console');

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_eb3af79ac0f1fb7e6d39bb6aeef8602c75669494';
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'secret key';

let appName = `Strobe`

// Welcome Page
router.get('/', (req, res) => {
  let userActive= false
  if (req.session.Users) {
    userActive = true
  }
  console.log(userActive);
  res.render('landing',{
    pageTitle:`Welcome to ${appName}`,
    userActive
  });
}
)


router.get('/handler', (req, res)=>{

  if (req.session.Users) {
    const role = req.session.Users.userRole
    const position = req.session.Users.position
    const session = req.session.Users
  
        if ((role == "super")) {
          req.flash("success_msg", `welcome ${session.First_name}`);
         return res.redirect("/super");

        } else if (role == "admin") {
          
          if (position == 'Logistics') {
            req.flash("success_msg", `welcome ${session.First_name}`);
            return res.redirect("/logistics");
          }

          if(position == "Attendant") {
            console.log("hi");
            req.flash("success_msg", `welcome ${session.First_name}`);
            return res.redirect("/employee");
          }

        } else if(role == "user"){
          req.flash("success_msg", `welcome ${session.First_name}`);
         return res.redirect("/user");
        }
  }else {
    req.flash("warning_msg", `please log in to use our resources`);
    res.redirect('/')
  }
 
})




router.get('/login', forwardAuthenticated, (req, res) => res.render('login',{
  pageTitle:"Login To continue Using Store Keeper"
  }));

  router.get('/register', forwardAuthenticated, (req, res) => res.render('register',{
    pageTitle:`Create account with ${appName}`,
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

// search and  category filter
router.get("/getItems/:id", ensureAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { search } = req.query;

  // console.log(id);
  // console.log(search);
  // Base query
  let query = `SELECT * FROM Products WHERE activate = ? AND total_on_shelf > ? AND status = ?`;
  let queryParams = ['yes', 0, 'not-expired'];

  // Add category condition
  if (id !== 'all') {
    query += ` AND category = ?`;
    queryParams.push(id);
  }

  // Add search condition
  if (search) {
    query += ` AND ProductName LIKE ?`;
    queryParams.push(`%${search}%`);
  }

  // Order by ProductName
  query += ` ORDER BY ProductName ASC`;

  // Execute the query
  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.log(err.sqlMessage);
      req.flash("error_msg", `${err.sqlMessage}`);
      return res.redirect('/user');
    } else {
      if (results.length <= 0) {
        return res.json([]);
      }

      return res.json(results);
    }
  });
});

// cart update actions
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
    const insertCartQuery = `INSERT INTO Cart (user_id, user_email, product_id, quantity, product_name,max, price_per_item, subtotal, uuid, image) VALUES ?`;
    const cartValues = req.body.cart.map(item => [

      userId,
      userEmail,
      item.id,
      item.quantity,
      item.name,
      item.max,
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

// check out cart item update
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


// paystack
router.post('/pay', async (req, res) => {
  const { email, amount } = req.body;

  try {
      const response = await axios.post('https://api.paystack.co/transaction/initialize', {
          email,
          amount: amount * 100, // Paystack expects the amount in kobo
          callback_url: `http://localhost:2000/verify`
      }, {
          headers: {
              Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
          }
      });

      res.json(response.data);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});


router.get('/verify', async (req, res) => {
  const reference = req.query.reference;

  try {
      const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
          headers: {
              Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
          }
      });

      if (response.data.status && response.data.data.status === 'success') {
          // Handle post-payment success actions here
          // console.log(response.data.data.reference);
          // console.log(response.data.data.paid_at);
          // console.log(response.data.data.customer.email);
          // console.log(response.data.data.customer.first_name);
          // console.log(response.data.data.customer.last_name);
          // console.log(response.data.data.authorization.authorization_code);
          // console.log(response.data.data.authorization.card_type);
          // console.log(response.data.data.authorization.bank);
          // console.log(response.data.data.authorization.signature);

           // Save transaction details to the database
      const { id, reference, amount, currency, status, customer: { email },paid_at } = response.data.data;
      const query = 'INSERT INTO transactions (transaction_id, reference, amount, currency, status, email,paid_at ) VALUES (?, ?, ?, ?, ?,?, ?)';

      // save the trransaction to the database
        db.query(query, [id, reference, amount / 100, currency, status, email, paid_at], (err, result) => {
          if (err){
            console.log(err);
            req.flash('error_msg', `payment error :${err.sqlMessage}`)
            return res.redirect('/user')
          };
          // no error
          console.log('Transaction saved to database');
          // req.flash('success_msg', `payment successful`)
          // redirect to submit order
          return res.redirect(`/user/order/${reference}`)
        }); // saving to db ends here

      } else {
          // Handle failed verification here
          console.log('Payment verification failed:', response.data.data);
          req.flash('error_msg', `payment unsuccessful`)
          return res.redirect('/user')
      }

      // res.json(response.data.reference);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// webhook
router.post('/webhook', (req, res) => {
  const hash = crypto.createHmac('sha512', WEBHOOK_SECRET).update(JSON.stringify(req.body)).digest('hex');
  if (hash === req.headers['x-paystack-signature']) {
      const event = req.body;

      switch (event.event) {
          case 'charge.success':
              console.log('Payment successful:', event.data);
              break;
          // Add more event types as needed
      }

      res.sendStatus(200);
  } else {
      res.sendStatus(400);
  }
});





  // logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});






router.post('/calculate-profit', (req, res) => {
  const amount = parseFloat(req.body.amount);
  const inventoryId = req.body.inventoryId;

  const query = 'SELECT Purchase_price, Total_damaged, Cost_of_delivery, QTY_recieved, total_in_pack FROM inventory WHERE id = ?';
  
  db.query(query, [inventoryId], (err, result) => {
    if (err) throw err;
    
    if (result.length > 0) {
      const { Purchase_price, Total_damaged, Cost_of_delivery, QTY_recieved, total_in_pack } = result[0];
      
      const total_cost_per_pack = Purchase_price + Cost_of_delivery + Total_damaged;
      const total_revenue_per_pack = amount * total_in_pack;
      const profit_per_pack = total_revenue_per_pack - total_cost_per_pack;
      const profit_margin_per_pack = (profit_per_pack / total_revenue_per_pack) * 100;
      
      const total_revenue_all_packs = total_revenue_per_pack * QTY_recieved;
      const total_cost_all_packs = total_cost_per_pack * QTY_recieved;
      const total_profit_all_packs = profit_per_pack * QTY_recieved;
      const total_profit_margin = (total_profit_all_packs / total_revenue_all_packs) * 100;
      
      res.json({
        success: true,
        profit_per_pack: profit_per_pack,
        profit_margin_per_pack: profit_margin_per_pack,
        total_profit_all_packs: total_profit_all_packs,
        total_profit_margin: total_profit_margin
      });
    } else {
      res.json({ success: false, error: 'No data found for the given ID.' });
    }
  });
});



  module.exports = router;