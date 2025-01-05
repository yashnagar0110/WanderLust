const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup = async (req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({email,username});
        const registerUser = await User.register(newUser,password);
        req.logIn(registerUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","user logged in");
            res.redirect("/listings");
        })
    }
    catch(e){
        
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    

}

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login = async(req,res)=>{
    req.flash("success","Logged in");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","user logged out");
        res.redirect("/listings");
    })
}