var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var User        = require("../models/user");
var async       = require("async");
var nodeMailer  = require("nodemailer");
var crypto      = require("crypto");

router.get("/forgot", (req, res)=>{
    res.render("forgot");
});

router.post("/forgot", (req, res, next)=>{
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, (err, buf)=>{
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            User.findOne({email: req.body.email}, (err, user)=>{
                if(err){
                    req.flash("error", 'Something went wrong, please try again.');
                    return res.redirect("/forgot");
                }
                if(!user){
                    req.flash('error', "No account with that email address exists.");
                    return res.redirect("/forgot");
                }
                user.resetToken = token;
                user.resetExpires = Date.now() + 3600000;
                user.save((err)=>{
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            var smtpTransport = nodeMailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                    user: 'nitish14india@gmail.com',
                    pass: process.env.GMAILPW
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'nitish14india@gmail.com',
                subject: 'Password Reset Link',
                text: 'You are recieving this because you (or someone else) have requested to reset password.\n' +
                    'Please click on the following link to complete the process.\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email.'
            };
            smtpTransport.sendMail(mailOptions, (err)=>{
                req.flash("success", "An e-mail has been to " + user.email + " with further instructions.");
                done(err,'done');
            });
        }
    ], function(err){
        if(err)
            return next(err);
        res.redirect("/campgrounds");
    });
});

router.get("/reset/:token", (req, res)=>{
    User.findOne({resetToken: req.params.token, resetExpires: { $gt: Date.now() }}, (err, user)=>{
        if(err){
            req.flash("error", 'Some error occured, please try again.');
            return res.redirect("/forgot");
        }
        if(!user){
            req.flash("error", 'Password reset token is invalid or is expired!');
            return res.redirect("/forgot");
        }
        res.render("reset", {token: req.params.token});
    });
});


router.post("/reset/:token", (req, res)=>{
    async.waterfall([
        function(done){
            User.findOne({resetToken: req.params.token, resetExpires: { $gt: Date.now() }}, (err, user)=>{
                if(err){
                    req.flash("error", 'Something went wrong, please try again.');
                    return res.redirect("/forgot");
                }
                if(!user){
                    req.flash("error", 'Password reset token is invalid or is expired!');
                    return res.redirect("back");
                }
                if(req.body.password === req.body.cnfpassword){
                    user.setPassword(req.body.password, (err)=>{
                        if(err){
                            req.flash("error", 'Something went wrong, please try again.');
                            return res.redirect("/forgot");
                        }
                        user.resetToken = undefined;
                        user.resetExpires = undefined;
                        
                        user.save((err)=>{
                            if(err){
                                req.flash("error", 'Something went wrong, please try again.');
                                return res.redirect("/forgot");
                            }
                            req.logIn(user, (err)=>{
                                done(err, user);
                            });
                        });
                    });
                } else {
                    req.flash("error", 'Passwords do not match.');
                    return res.redirect('back');
                }
            });
        },
        function(user, done){
            var smtpTransport = nodeMailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                    user: 'nitish14india@gmail.com',
                    pass: process.env.GMAILPW
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'nitish14india@gmail.com',
                subject: 'Password Changed',
                text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.email + 'has just been changed!'
            };
            smtpTransport.sendMail(mailOptions, (err)=>{
                req.flash("success", "Your password has been changed.");
                done(err,'done');
            });
        }
    ], function(err){
        if(err){
            req.flash("error", 'Something went wrong, please try again.');
            return res.redirect("/forgot");
        }
        res.redirect("/campgrounds");
    });
});


module.exports = router;