const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js"); 
const passport = require("passport"); 
const { isLoggedIn, saveRedirectUrl } = require("../middleware.js"); 
const usercontroller = require("../controllers/user.js"); 

// Render signup form
router.get("/signup", usercontroller.renderSignupForm);

// Handle signup form submission
// Wraps in async error handler
router.post("/signup", wrapAsync(usercontroller.signup));

// Render login form
router.get("/login", usercontroller.renderLoginForm);

// Handle login form submission
// 1. saveRedirectUrl middleware saves attempted URL
// 2. passport.authenticate validates credentials (local strategy)
// 3. If success → usercontroller.login, else → redirect with flash error
router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    usercontroller.login
);

// Handle logout
// Only logged-in users can log out
router.get("/logout", isLoggedIn, usercontroller.logout);

module.exports = router;
