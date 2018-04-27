var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var User        = require("../models/user");

// ===================== ROOT ROUTE ========================

router.get("/", (req, res)=>{
    res.render('landing');
});



// ==================== AUTH ROUTES ======================

// ================== REGISTER ROUTES ======================

router.get("/register", (req, res)=>{
    res.render("register");
});

router.post("/register", (req, res)=>{
    User.register(
        new User({username: req.body.username}),
        req.body.password,
        (err, user)=>{
            if(err){
                req.flash("error", err.message);
                // console.log(err);
                return res.redirect("/register");
            }
            passport.authenticate("local")(req, res, ()=>{
                req.flash("success", "Welcome to Yelp Camp " + user.username.replace(/\b\w/g, l => l.toUpperCase()));
                res.redirect("/campgrounds");
            });
        }
    );
});

// ==================== LOGIN ROUTES ======================

router.get("/login", (req, res)=>{
    res.render("login");
});

router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        failureFlash: true
    }), (req, res)=>{}
);

// =================== LOGOUT ROUTE ========================

router.get("/logout", (req, res)=>{
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});


router.get("*", (req, res)=>res.send("Page Not Found."));
router.post("*", (req, res)=>res.send("Page Not Found."));

module.exports = router;