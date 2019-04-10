module.exports ={
	isAdmin: (req,res,next)=>{
		if(req.isAuthenticated() && req.user.role == "admin")
			return next();
			req.flash("error_msg", "Admin login required.");
			res.redirect("/users/login");
	},

	isLoggedIn: (req,res,next)=>{
		if(req.isAuthenticated())
			return next();
			req.flash("error_msg", "You must be logged in.");
			res.redirect("/users/login");
	},

	logggedInAlready:(req, res, next)=>{
        if(req.isAuthenticated())
            res.redirect('/resources');  
        else
            return next();
    }
}
