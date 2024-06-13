module.exports = {
  isLogistics: function(req, res, next) {
    const userPosition = req.session.Users.position;
    const userRole = req.session.Users.userRole;

    if (userPosition === "Logistics") {
      return next();

    } else if (userPosition === "Attendant") {

      req.flash('warning_msg', 'That is not your role');
      return res.redirect('/employee');
      
    } else if (userRole === "user") {
      req.flash('warning_msg', 'That is not your role');
      return res.redirect('/user');

    } else if (userRole === "super") {
      req.flash('warning_msg', 'That is not your role');
      return res.redirect('/super');
    }
  }
}
