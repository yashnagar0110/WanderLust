const Listing = require("../models/listing.js");

// Show all listings
module.exports.index = async (req, res) => {
    const data = await Listing.find({});
    res.render("listings/index.ejs", { data });
}

// Render form to create new listing
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

// Show a single listing with reviews and owner populated
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const data = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" }
        })
        .populate("owner");
    if (!data) {
        req.flash("error", "Listing Does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { data });
}

// Create new listing
module.exports.newListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newlistings = new Listing(req.body.listings);
    newlistings.owner = req.user._id; // set current user as owner
    newlistings.image = { filename, url }; // attach uploaded image
    await newlistings.save();
    req.flash("success", "New Listing Created !");
    res.redirect("/listings");
}

// Render edit form for a listing
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const data = await Listing.findById(id);
    if (!data) {
        req.flash("error", "Listing Does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { data });
}

// Update existing listing
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listings });
    // If a new image was uploaded, replace old image
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { filename, url };
        listing.save();
    }
    req.flash("success", "Listing Updated !");
    res.redirect(`/listings/${id}`);
}

// Delete a listing
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted !");
    res.redirect("/listings");
}
