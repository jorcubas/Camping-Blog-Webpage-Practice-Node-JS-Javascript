// ==================
// Campground Routes
// =================
var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds")

router.get("/", function(req, res){
	console.log(req.user);
// 	Get All Campgrounds from DB 
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
		}
	});
	// res.render("campgrounds", {campgrounds: campgrounds});
});

router.post("/", isLoggedIn, function(req, res){
// 	getdata from form and add campgrounds to array 
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id, 
		username: req.user.username
	}
	var newCampground = {name: name, image: image, description: desc, author: author}
// 	Create a New Campaground and Save to DataBase
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		}
		else{
			console.log(newlyCreated);
			res.redirect("/");
		}
	});
// 	redirect to campgrounds page 
// 	default es redirect a get request 
	
});

router.get("/new", isLoggedIn, function(req, res){
	res.render("campgrounds/new.ejs")
});

router.get("/:id", function(req, res){
// 	Find the Campground With Provided ID 
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log("error fin by id");
		}
		else{
			console.log(foundCampground);
			// 	Render the show tempalate with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});

});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	else{
		res.redirect("/login");
	}
}

module.exports = router;