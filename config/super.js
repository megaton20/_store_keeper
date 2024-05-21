module.exports = {
    isSuper: function(req, res, next){
  
      const userPosition = req.session.Users.position;
      const userRole = req.session.Users.userRole;
  
      if (userPosition === "Logistics") {
        req.flash('warning_msg', 'That is not your role');
        return res.redirect('/logistics');
      } else if (userPosition === "Attendant") {
        req.flash('warning_msg', 'That is not your role');
        return res.redirect('/employee');
      } else if (userRole === "user") {
        req.flash('warning_msg', 'That is not your role');
        return res.redirect('/user');
      } else if (userRole === "super") {
        return next();
        
      }
    }
      
  }