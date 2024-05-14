const express = require('express')
const app = express()
const path = require("path")
const bodyParser = require('body-parser');
const session = require('express-session')
const flash = require('connect-flash');
const dotenv = require("dotenv");
const methodOverride = require('method-override')
const ejsLayouts = require("express-ejs-layouts")


const usb = require('usb');
const escpos = require('escpos');





// Function to print a receipt
function printReceipt(items, totalPrice) {
    try {
        // Find the USB printer
        const device = usb.findByIds(0x0483, 0x5740); // Change the IDs as per your printer's specifications
        
        if (!device) {
            throw new Error('Printer not found');
        }

        // Open the printer device
        const printer = device.open();
        
        if (!printer) {
            throw new Error('Failed to open printer');
        }
        
        // Claim the printer interface
        const interfaceNumber = device.interfaces[0].interfaceNumber;
        printer.interface(interfaceNumber);
        
        // Send ESC/POS commands to the printer
        const commands = [];
        commands.push('\x1b\x40'); // Initialize printer
        commands.push('\x1b\x61\x01'); // Center align text
        commands.push('\x1b\x45\x01'); // Bold text
        commands.push('Welcome to My Store\n'); // Header
        commands.push('-------------------------\n');

        items.forEach(item => {
            commands.push(`${item.name}   ${item.price}\n`); // Item
        });

        commands.push('-------------------------\n');
        commands.push(`Total: ${totalPrice}\n`); // Total price
        commands.push('-------------------------\n');
        commands.push('\x1d\x56\x00'); // Cut paper

        printer.write(commands.join(''));

        // Release the printer interface
        printer.close();
        
        console.log('Receipt printed successfully');
    } catch (error) {
        console.error('Error printing receipt:', error.message);
    }
}

// Example usage
const items = [
    { name: 'Item 1', price: '$10.00' },
    { name: 'Item 2', price: '$15.00' },
    { name: 'Item 3', price: '$20.00' }
];
const totalPrice = '$45.00';

printReceipt(items, totalPrice);





const PORT = process.env.PORT || 2000
const openRoutes = require('./router/index.js')
const authRouter = require('./router/auth')
const adminRouter = require('./router/admin')
const userRouter =  require('./router/userRouter.js')
const employeeRouter =  require('./router/employeeRouter.js')


app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json())

app.set('view engine', 'ejs')
app.use(ejsLayouts)
app.use(express.static(path.join(__dirname, './', 'public')))



app.use(session({
    secret: 'cat is alive',
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, 
    resave: false,
    saveUninitialized : true
}));


app.use(methodOverride((req, res)=>{
  if(req.body && typeof req.body === 'object' && '_method' in req.body){
      // look for urlencoded body and delete it
      let method = req.body._method
      delete req.body._method
      return method
  }
}))

app.use(flash());

// ------------ Global variables  flash msg
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.warning_msg = req.flash('warning_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


app.use('/', openRoutes);
app.use('/auth', authRouter)
app.use('/super', adminRouter)
app.use('/employee', employeeRouter)
app.use('/user', userRouter)

// 404 route
app.use(function(req, res, next) {
  res.status(404)
  res.render('404')
})

app.listen(PORT, console.log(`app running on port ${PORT}`))