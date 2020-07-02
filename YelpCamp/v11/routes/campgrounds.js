// ==================
// Campground Routes
// =================
var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var middleware = require("../middleware");

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

router.post("/", middleware.isLoggedIn, function(req, res){
// 	getdata from form and add campgrounds to array 
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id, 
		username: req.user.username
	}
	var newCampground = {name: name, price: price, image: image, description: desc, author: author}
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

router.get("/new", middleware.isLoggedIn, function(req, res){
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

// Edit Campground Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

// Update Campground Route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	// 	Find and Update Correct Campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});


// Destroy Campground Route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	});
});



// Middleware
// function isLoggedIn(req, res, next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	else{
// 		res.redirect("/login");
// 	}
// }

// function checkCampgroundOwnership(req, res, next){
// 	if(req.isAuthenticated()){
// 		Campground.findById(req.params.id, function(err, foundCampground){
// 		// 	Is User Logged In At All
// 			if(err){
// 				res.redirect("back");
// 			} else{
// 				// 	Does User Own the Campground
// 				if(foundCampground.author.id.equals(req.user._id)){
// 					next();
// 				}
// 				else{
// 					res.redirect("back");
// 				}
// 			}
// 		});
// 	} else{
// 		res.redirect("back");
// 	}
// }




module.exports = router;