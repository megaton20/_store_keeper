const mysql = require ('mysql');

const db = mysql.createConnection( {
    host: "localhost",
    user:'root',
    password: "",
    database: "storeManagenent"
})

db.connect((err)=> {
    if(err) {
        console.log('error from databse')
    } else{
        console.log("database up and running...") 
    }
})

module.exports = db;