#REST (Representational State Transfer)
#RESTful Routing
#CRUD (Create, Read, Update, Delete)

Name        URL                     Method  Description
===========================================================================
INDEX       /campgrounds            GET     Display all Campgrounds
NEW         /campgrounds/new        GET     Form to add new Campground
CREATE      /campgrounds            POST    Add new Campground
SHOW        /campgrounds/:id        GET     Show Detailed info on a Campground
EDIT        /campgrounds/:id/edit   GET     Show Edit form for Campground
UPDATE      /campgrounds/:id        PUT     Update a particular Campground
DESTROY     /campgrounds/:id        DELETE  Delete a particular Campground