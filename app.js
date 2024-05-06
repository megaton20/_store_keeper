const express = require('express')
const app = express()
const path = require("path")
const bodyParser = require('body-parser');
const session = require('express-session')
const flash = require('connect-flash');
const dotenv = require("dotenv");
const methodOverride = require('method-override')
const ejsLayouts = require("express-ejs-layouts")

const PORT = process.env.PORT || 2000
const openRoutes = require('./router/index.js')
const authRouter = require('./router/auth')
const adminRouter = require('./router/admin')
const userRouter =  require('./router/userRouter.js')


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

//------------ Global variables  flash msg
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.warning_msg = req.flash('warning_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


app.use('/', openRoutes);
app.use('/auth', authRouter)
app.use('/admin', adminRouter)
app.use('/user', userRouter)

// 404 route
app.use(function(req, res, next) {
  res.status(404)
  res.render('404')
})

app.listen(PORT, console.log(`app running on port ${PORT}`))