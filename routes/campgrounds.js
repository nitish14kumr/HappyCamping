var express     = require("express");
var router      = express.Router();
var Campground  = require("../models/campground");
var middleware  = require("../middleware");

// =================== SHOW CAMPGROUNDS ====================

router.get("/", (req, res)=>{
    // console.log(req.user);
    Campground.find({}, (err, campgrounds)=>{
        if(err){
            req.flash("error", "Something went wrong!!");
            // console.log(err);
        }
        else{
            res.render("campgrounds/index", {campgrounds:campgrounds});
        }
    });
});

// ================ NEW CAMPGROUND FORM ROUTE ================

router.get("/new", middleware.isLoggedIn, (req, res)=>{
    res.render('campgrounds/new');
});

// =================== NEW CAMPGROUND ROUTE ==================

router.post("/", middleware.isLoggedIn, (req, res)=>{
    var newCampground = req.body.campground;
    var author = {
        id : req.user._id,
        username: req.user.username
    };
    newCampground.author = author;
    // console.log(newCampground);
    Campground.create(newCampground, (err, campground)=>{
        if(err){
            req.flash("error", "Something went wrong!!");
            // console.log(err);
        }
        else{
            // console.log(campground);
            req.flash("success", "Campground added successfully!!");
            res.redirect("/campgrounds");
        }
    });
});

// =================== SHOW CAMPGROUND ROUTE =======================

router.get("/:id", (req, res)=>{
    Campground.findById(req.params.id).populate("comments").exec((err, campground)=>{
        if(err){
            req.flash("error", "Something went wrong!!");
            // console.log(err);
        }
        else {
            // console.log(campground.comments);
            // console.log(req.user);
            res.render("campgrounds/show", {campground: campground});
        }
    });
});

// =================== EDIT CAMPGROUND ROUTE ================

router.get("/:id/edit", middleware.isLoggedIn, middleware.checkCampgroundOwner, (req, res)=>{
    Campground.findById(req.params.id, (err, campground)=>{
        if(err){
            req.flash("error", "Something went wrong!!");
            // res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit", {campground: campground});
        }
    });
});

// =================== UPDATE CAMPGROUND ROUTE ================

router.put("/:id", middleware.isLoggedIn, middleware.checkCampgroundOwner, (req, res)=>{
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground)=>{
        if(err){
            req.flash("error", "Something went wrong!!");
            // res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground successfully updated!!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// ================== DESTROY CAMPGROUND ROUTE =================

router.delete("/:id", middleware.isLoggedIn, middleware.checkCampgroundOwner, (req, res)=>{
    // res.send("DELETE ROUTE");
    Campground.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            req.flash("error", "Something went wrong!!");
            // res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground successfully deleted!!");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;
