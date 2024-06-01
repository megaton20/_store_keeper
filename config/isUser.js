module.exports = {
    isUser: function(req, res, next){
  
      const userPosition = req.session.Users.position;
      const userRole = req.session.Users.userRole;
  
      if (userPosition === "Logistics") {
        req.flash('warning_msg', 'That is not your role stick to logistics');
        return res.redirect('/logistics');

      } else if (userPosition === "Attendant") {
        req.flash('warning_msg', 'That is not your role stick to attendant');
        return res.redirect('/employee');

      } else if (userRole === "user") {
        return next();
      } else if (userRole === "super") {
        req.flash('warning_msg', 'That is not your role stick to admin');
        return res.redirect('/super');
        
      }
    }
      
  }