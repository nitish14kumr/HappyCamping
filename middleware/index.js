var Campground  = require("../models/campground");
var Comment     = require("../models/comment");

module.exports = {
    checkCampgroundOwner:
        function (req, res, next){
            Campground.findById(req.params.id, (err, campground)=>{
                if(err){
                    // console.log(err);
                    req.flash("error", "Some error occured!!");
                    res.redirect("back");
                } else {
                    
                    if (!campground) {
                        req.flash("error", "Item not found.");
                        return res.redirect("back");
                    }
                    
                    if(campground.author.id.equals(req.user._id)) {
                        // console.log("Matched User");
                        next();
                    } else {
                        // console.log("User Not Matched");
                        req.flash("error", "You do not have permission to do that!");
                        res.redirect("/campgrounds/" + campground._id);
                    }
                }
            });
        },
                
    checkCommentOwner:
        function checkCommentOwner(req, res, next){
            Comment.findById(req.params.comment_id, (err, comment)=>{
                if(err){
                    req.flash("error", "Some error occured!!");
                    res.redirect("back");
                } else {
                    
                    if (!comment) {
                        req.flash("error", "Item not found.");
                        return res.redirect("back");
                    }
                    
                    if(comment.author.id.equals(req.user._id)) {
                        next();
                    } else {
                        req.flash("error", "You do not have permission to do that!");
                        res.redirect("/campgrounds/" + req.params.id);
                    }
                }
            });
        },
        
    isLoggedIn:
        function (req, res, next){
            if(req.isAuthenticated())
                return next();
            req.flash("error", "You should be logged in to do that.");
            res.redirect("/login");
        }
}

                

        

        