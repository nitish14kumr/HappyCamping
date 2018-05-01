var express     = require("express");
var router      = express.Router();
var Campground  = require("../models/campground");
var middleware  = require("../middleware");
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

// =================== SHOW CAMPGROUNDS ====================

router.get("/", (req, res)=>{
    // console.log(req.user);
    Campground.find({}, (err, campgrounds)=>{
        if(err){
            req.flash("error", "Something went wrong!!");
            // console.log(err);
        }
        else{
            res.render("campgrounds/index", {campgrounds: campgrounds, page: "campgrounds"});
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
    geocoder.geocode(newCampground.location, (err, data)=>{
        if(err){
            req.flash("error", "Invalid Address!!");
            return res.redirect("back");
        } else {
            // console.log(data);
            newCampground.lat = data[0].latitude;
            newCampground.lng = data[0].longitude;
            newCampground.location = data[0].formattedAddress;
            Campground.create(newCampground, (err, campground)=>{
                if(err){
                    req.flash("error", "Something went wrong!! Please try again.");
                    res.redirect("/campgrounds");
                    // console.log(err);
                }
                else{
                    // console.log("Lat and Lng");
                    // console.log(campground.lat);
                    // console.log(campground.lng);
                    req.flash("success", "Campground added successfully!!");
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    });
});

// =================== SHOW CAMPGROUND ROUTE =======================

router.get("/:id", (req, res)=>{
    Campground.findById(req.params.id).populate("comments").exec((err, campground)=>{
        if(err){
            req.flash("error", "Something went wrong!!");
            res.redirect("/campgrounds");
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
            res.redirect("/campgrounds");
            // res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit", {campground: campground});
        }
    });
});

// =================== UPDATE CAMPGROUND ROUTE ================

router.put("/:id", middleware.isLoggedIn, middleware.checkCampgroundOwner, (req, res)=>{
    var updateCampground = req.body.campground;
    geocoder.geocode(updateCampground.location, (err, data)=>{
        if(err){
            req.flash("error", "Invalid Address!!");
            res.redirect("back");
        } else {
            updateCampground.lat = data[0].latitude;
            updateCampground.lng = data[0].longitude;
            updateCampground.location = data[0].formattedAddress;
            
            Campground.findByIdAndUpdate(req.params.id, updateCampground, (err, campground)=>{
                if(err){
                    req.flash("error", "Something went wrong!!");
                    // res.redirect("/campgrounds");
                } else {
                    req.flash("success", "Campground successfully updated!!");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });
        }
    });
            
});

// ================== DESTROY CAMPGROUND ROUTE =================

router.delete("/:id", middleware.isLoggedIn, middleware.checkCampgroundOwner, (req, res)=>{
    // res.send("DELETE ROUTE");
    Campground.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            req.flash("error", "Something went wrong!!");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground successfully deleted!!");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;
