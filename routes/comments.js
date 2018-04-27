var express     = require("express");
var router      = express.Router({mergeParams: true});
var Campground  = require("../models/campground");
var Comment     = require("../models/comment");
var middleware  = require("../middleware");

// ==================== NEW COMMENT ROUTE ======================

router.get("/new", middleware.isLoggedIn, (req, res)=>{
    Campground.findById(req.params.id, (err, campground)=>{
        if(err){
            req.flash("error", "Something went wrong!!");
            // console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

// =================== ADD COMMENT ROUTE ======================

router.post("/", middleware.isLoggedIn, (req, res)=>{
    Campground.findById(req.params.id, (err, campground)=>{
        if(err){
            req.flash("error", "Something went wrong!!");
            // console.log(err);
            res.redirect("/campgrounds");
        } else{
            Comment.create(req.body.comment, (err, comment)=>{
                if(err){
                    req.flash("error", "Something went wrong!!");
                    // console.log(err);
                } else {
                    // console.log("Comment Author:" + req.user);
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    // console.log(comment);
                    res.redirect("/campgrounds/"+req.params.id); 
                }
            });         
        }
    });
});

// ==================== EDIT COMMENT ROUTE ======================

router.get("/:comment_id/edit", middleware.isLoggedIn, middleware.checkCommentOwner, (req, res)=>{
    Comment.findById(req.params.comment_id, (err, comment)=>{
        if(err){
            req.flash("error", "Something went wrong!!");
            res.redirect("back");
        } else {
            res.render("comments/edit", {comment: comment, campground_id: req.params.id});
        }
    });
});

// =================== UPDATE COMMENT ROUTE ======================

router.put("/:comment_id", middleware.isLoggedIn, middleware.checkCommentOwner, (req, res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment)=>{
        if(err){
            req.flash("error", "Something went wrong!!");
            res.redirect("back");
        } else {
            req.flash("success", "Comment successfully updated!!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

// =================== DELETE COMMENT ROUTE ======================

router.delete("/:comment_id", middleware.isLoggedIn, middleware.checkCommentOwner, (req, res)=>{
    Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
        if(err){
            req.flash("error", "Something went wrong!!");
            res.redirect("back");
        } else {
            req.flash("success", "Comment successfully deleted!!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;