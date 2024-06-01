module.exports = {
  isAttendant: function(req, res, next) {
    const userPosition = req.session.Users.position;
    const userRole = req.session.Users.userRole; // Corrected typo

    if (userPosition === "Attendant") {
      return next();
    } else if (userPosition === "Logistics") {
      req.flash('warning_msg', 'That is not your role');
      return res.redirect('/logistics');
    } else if (userRole === "user") {
      req.flash('warning_msg', 'That is not your role');
      return res.redirect('/user');
    } else if (userRole === "super") {
      req.flash('warning_msg', 'That is not your role');
      return res.redirect('/super');
    }
  }
}
