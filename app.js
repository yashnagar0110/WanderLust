// Load environment variables from .env file in development
if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");

const MONGO_URL = process.env.ATLASDB_URL; // MongoDB connection URL
const path = require("path");
const MethodOverride = require("method-override"); // Allow HTTP verbs like PUT/DELETE in forms
const ejsMate = require("ejs-mate"); // EJS template engine with layouts support
const ExpressError = require("./utils/ExpressError.js"); // Custom error handling class
const session = require("express-session"); // Session middleware
const MongoStore = require('connect-mongo'); // Store sessions in MongoDB
const flash = require("connect-flash"); // Flash messages
const passport = require("passport"); // Authentication middleware
const LocalStrategy = require("passport-local"); // Local username/password strategy
const User = require("./models/user.js"); // User model

// Route imports
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Middleware setup
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(MethodOverride("_method")); // Support ?_method=DELETE/PUT in forms
app.use(express.static(path.join(__dirname, "/public"))); // Serve static files

// Session store configuration
const store = MongoStore.create({
    mongoUrl: MONGO_URL,
    crypto: {
        secret: process.env.SECRET // Encrypt session data
    },
    touchAfter: 24 * 3600, // Reduce session update frequency
});

// Handle errors in session store
store.on("error", (err) => {
    console.log("Error in mongo store", err);
});

// Session options
const sessOpt = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
};
app.use(session(sessOpt));
app.use(flash());

// Passport authentication middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // Use local auth with passport-local-mongoose

passport.serializeUser(User.serializeUser()); // Serialize user into session
passport.deserializeUser(User.deserializeUser()); // Deserialize user from session

// Global middleware to add user and flash messages to templates
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// Database connection
main()
    .then(() => {
        console.log("DB connected");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

// Routes
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", userRouter);

// Handle 404 errors
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found !"));
});

// Error-handling middleware
app.use((err, req, res, next) => {
    console.log(err);
    let { statusCode = 500, message = "Something Went Wrong !" } = err;
    res.status(statusCode).render("listings/error.ejs", { err });
});

// Start server
app.listen(8080, () => {
    console.log("listening to port 8080");
});
