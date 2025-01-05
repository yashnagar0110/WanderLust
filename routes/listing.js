const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingcontroller = require("../controllers/listings.js");
const {storage} = require("../cloudConfig.js");
const multer = require("multer");
const upload = multer({ storage })

router.route("/")
    .get( wrapAsync(listingcontroller.index))
    .post(isLoggedIn,upload.single("listings[image]"),validateListing,wrapAsync(listingcontroller.newListing));
    

router.get("/new",isLoggedIn,listingcontroller.renderNewForm);

router.route("/:id")
    .get( wrapAsync(listingcontroller.showListing))
    .put( 
        isLoggedIn,
        isOwner,
        upload.single("listings[image]"),
        validateListing,
        wrapAsync(listingcontroller.updateListing))
    .delete(isLoggedIn,isOwner, wrapAsync(listingcontroller.deleteListing));

router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingcontroller.renderEditForm));


module.exports = router;