var passportLocalMongoose   = require("passport-local-mongoose"),
    mongoose                = require("mongoose");

var userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    username: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    resetToken: String,
    resetExpires: Date,
    password: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);