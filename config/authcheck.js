module.exports = {
  isAdmin: (req, res, next) => {
    console.log(req.user);
    if (req.isAuthenticated() && req.user.role == "admin") return next();
    // else if (req.isAuthenticated()) {
    //   res.redirect("/api/v1");
    // }
    req.flash("error_msg", "Admin login required.");
    res.redirect("/api/v1");
  },

  isLoggedIn: (req, res, next) => {
    // console.log(req.user);
    if (req.isAuthenticated()) {
      //   console.log(req.user);
      return next();
    }
    req.flash("error_msg", "You must be logged in.");
    res.redirect("/api/v1/users/login");
  },

  loggedInAlready: (req, res, next) => {
    if (req.isAuthenticated()) res.redirect("/api/v1");
    else return next();
  }
};
