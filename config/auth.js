


module.exports = {
  ensureAuthenticated: function(req, res, next) {
    let openSession =  req.session && req.session.employees
    if (openSession) {
      return next();
    }
    req.flash("error_msg", "Please Enter Credentials to Continue")
    res.redirect('/')
    return
  },
  forwardAuthenticated: function(req, res, next) {
    
    let openSession =  req.session && req.session.employees

    if (!openSession) {
      return next()
    }
    req.flash("error_msg", `Already loged in as ${openSession.FirstName}`)
    return res.redirect('/admin')
     
    }
};