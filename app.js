if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
// console.log(process.env.CLOUD_NAME);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const MONGO_URL = process.env.ATLASDB_URL;
const path = require("path");
const MethodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(MethodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl : MONGO_URL,
    crypto :{
        secret : process.env.SECRET
    },
    touchAfter : 24*3600,
})
store.on("error",()=>{
    console.log("Error in mongo store",err);
})
const sessOpt = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true
}

// app.get("/", (req, res) => {
//     res.send("Hi I am root");
// })


app.use(session(sessOpt));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

main()
    .then(() => {
        console.log("DB connected")
    })
    .catch(err => console.log(err));
async function main() {
    await mongoose.connect(MONGO_URL);
}

// app.get("/demo", async (req,res)=>{
//     let fakeUser = new User({
//         email : "abc@gmail.com",
//         username : "abc22",
//         password : "5d56cr"
//     })
//     let registerUser = await User.register(fakeUser,"hello");
//     res.send(registerUser);
// })

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",userRouter);


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found !"));
})

app.use((err, req, res, next) => {
    console.log(err);
    let { statusCode=500, message="Something Went Wrong !" } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("listings/error.ejs",{err});

})


app.listen(8080, () => {
    console.log("listening to port 8080");
})