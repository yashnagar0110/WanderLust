const User = require("../models/user.js");

// Render signup form
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}

// Handle signup and register new user
module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        // Passport-local-mongoose handles hashing
        const registerUser = await User.register(newUser, password);
        // Automatically log in after registration
        req.logIn(registerUser, (err) => {
            if (err) return next(err);
            req.flash("success", "user logged in");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

// Render login form
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}

// Handle login (passport middleware already authenticates)
module.exports.login = async (req, res) => {
    req.flash("success", "Logged in");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

// Handle logout
module.exports.logout = (req, res) => {
    req.logOut((err) => {
        if (err) return next(err);
        req.flash("success", "user logged out");
        res.redirect("/listings");
    });
}
