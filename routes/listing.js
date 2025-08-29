const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); // Utility to catch async errors
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js"); // Custom middleware
const listingcontroller = require("../controllers/listings.js"); // Controller for listing logic
const { storage } = require("../cloudConfig.js"); // Cloudinary storage config
const multer = require("multer");
const upload = multer({ storage }); // Multer handles file uploads

// Route: /listings
router.route("/")
    // Show all listings
    .get(wrapAsync(listingcontroller.index))
    // Create new listing (only if logged in, with image upload, validated)
    .post(
        isLoggedIn,
        upload.single("listings[image]"), // handle single image upload
        validateListing, // validate request body
        wrapAsync(listingcontroller.newListing)
    );

// Render form for creating new listing
router.get("/new", isLoggedIn, listingcontroller.renderNewForm);

// Route: /listings/:id
router.route("/:id")
    // Show one listing
    .get(wrapAsync(listingcontroller.showListing))
    // Update listing (only if logged in & owner, with optional new image)
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listings[image]"),
        validateListing,
        wrapAsync(listingcontroller.updateListing)
    )
    // Delete listing (only if logged in & owner)
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingcontroller.deleteListing)
    );

// Render edit form for a listing
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingcontroller.renderEditForm)
);

module.exports = router;
