const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isreviewAuthor ,validateReview} = require("../middleware.js");
const reviewcontroller = require("../controllers/review.js");

router.post("/",isLoggedIn,validateReview,wrapAsync(reviewcontroller.createReview));

router.delete("/:reviewId",isLoggedIn,isreviewAuthor, wrapAsync(reviewcontroller.deleteReview));


module.exports = router;