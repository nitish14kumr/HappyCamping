var passportLocalMongoose   = require("passport-local-mongoose"),
    mongoose                = require("mongoose");

var userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    username: String,
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);