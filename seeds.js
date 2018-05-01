var Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    mongoose    = require("mongoose");
    
// var campgroundData = [
//     {
//         name: "Cloud's Rest", 
//         image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
//         description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
//     },
//     {
//         name: "Desert Mesa", 
//         image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
//         description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
//     },
//     {
//         name: "Canyon Floor", 
//         image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
//         description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
//     }
// ];

// var commentData = [
//     {
//         text: "This place is great, but i wish there was internet.",
//         author: "Jon Snow"
//     },
//     {
//         text: "I loved the services that are provided here by the staff present.",
//         author: "Arya Stark"
//     },
//     {
//         text: "This is a great spot for the whole family to get together and enjoy some quality time.",
//         author: "Ned Stark"
//     },
//     {
//         text: "Not so good as they all say. I hated it from the depths of my heart and curse you all for saying it's a good spot.",
//         author: "Cersei Lannister"
//     }
// ];

function seedDB(){
    // Removing Campgrounds
    Campground.remove({}, (err)=>{
        if(err){
            console.log(err);
        } else {
            console.log("Deleted all data!!");
            Comment.remove({}, (err)=>{
                if(err){
                    console.log(err);
                } else {
                    User.remove({});
                    // Adding Campgrounds
                    // campgroundData.forEach(function(campgroundSeed){
                    //     Campground.create(campgroundSeed, (err, campground)=>{
                    //         if(err){
                    //             console.log(err);
                    //         } else {
                    //             console.log("Added a Campground");
                                
                    //             // Adding Comment
                    //             Comment.create({
                    //                 text: "This place is great, but i wish there was internet.",
                    //                 author: "Homer"
                    //             }, (err, comment)=>{
                    //                 if(err){
                    //                     console.log(err);
                    //                 } else {
                    //                     campground.comments.push(comment);
                    //                     campground.save();
                    //                     console.log("Created new Comment");
                    //                 }
                    //             });
                    //         }
                    //     });
                    // });
                }
            });      
        }
    });
}

module.exports = seedDB;