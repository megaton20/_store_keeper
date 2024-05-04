const db = require("../model/databaseTable");
const stateData = require("../model/stateAndLGA");

const systemCalander = new Date().toLocaleDateString()
const yearModel = require("../model/getYear");
let presentYear = yearModel(systemCalander, '/')

const monthNameModel = require('../model/findCurrentMonth');
let monthName = monthNameModel(systemCalander, '/')

const dayModel = require('../model/dayOfWeek')
let dayName = dayModel(systemCalander, '/')

const monthModel = require('../model/getMonth')
let presentMonth = monthModel(systemCalander, '/')

const getDay = require('../model/getDay');
const { parse } = require("dotenv");
let presentDay = getDay(systemCalander, '/')

 let sqlDate = presentYear +  "-" + presentMonth + "-" + presentDay


exports.cartForm = (req,res)=> {
    
let employeeId = req.session.employees.email
   
 


    var metaItems = JSON.parse(req.body.meta)
    var cartItems = JSON.parse(req.body.cart)

    let productName,price, uuid , unknownStore

     // to make sure we got something in the cart 
     if (cartItems.length <=0) {
        
        req.flash("error_msg", "Cart cannot  be empty")
        res.redirect('/admin/create-sales')
        return
    }


    // checking employee id

     db.query(`SELECT * FROM Employees WHERE email = '${employeeId}' `,  (err, results)=>{
        if (err) {
            console.log(err);
            req.flash('error-msg',`${err.sqlMessage}`)
            return res.redirect('/admin/create-sales')
        }
        let data = JSON.stringify(results);
        let allEmployee = JSON.parse(data);
        
        // to get store id
        db.query(`SELECT * FROM Stores WHERE store_name = '${allEmployee[0].Store}' `, (err, results)=>{
            if (err) {
                console.log(err.sqlMessage);
                req/flash('error_msg',  `error form database:  ${err.sqlMessage}`)
                res.redirect('/admin/create-sales')
            }
            
            
            if (results.length <= 0) {
                unknownStore = "unknown store"
            }
            
            let data = JSON.stringify(results);
            let storeData = JSON.parse(data);
            
            // creating a unique sale id each  time sale is neing made
            var uuidForEachSale = Date.now()+Math.floor(Math.random()*1000)


            let insertData = {
                sale_id:uuidForEachSale,
                store_id:storeData[0].id,
                store_name:storeData[0].store_name,
                created_date:sqlDate,
                attendant_id:allEmployee[0].id,
                Payment_type:metaItems.paymentType,
                total_amount:metaItems.sumTotal,
            }
            
            db.query("INSERT INTO Sales SET ? ", insertData, (error, result) => {
                if (error) {
                    console.log(error);
                    req.flash('errror_msg', `error from db ${error.sqlMessage}`)
                    res.redirect('/admin/create-sales')
                    return 
                }
                
                // Step 2: Iterate through products in the cart
  // Define an array to store promises
const promises = [];

cartItems.forEach(cartItem => {
    const { id, name, price } = cartItem;

    let productItem = {
        sale_id: uuidForEachSale,
        product_id: id,
        price_per_item: price,
        store_id: storeData[0].id,
        name: name
    };

    // Push the promise into the array
    promises.push(new Promise((resolve, reject) => {
        // Step 3: Insert or retrieve product record from Products table
        db.query("INSERT INTO Order_Products SET ?", productItem, async (error, result) => {
            if (error) {
                console.log(error);
                reject("Error creating sales_products");
                return;
            }

            // Resolve the promise
            resolve(result);
        });
    }));
});

// Wait for all promises to resolve
Promise.all(promises)
    .then(() => {
        console.log("sales created");
        req.flash("success_msg", `Cart has been submitted, click here to print receipt.`);
        res.redirect('/admin/create-sales');
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({ error: "Error creating sales_products" });
    });
    
            })
}

)})
    
}