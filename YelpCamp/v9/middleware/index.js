// all middleware goes here
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
		// 	Is User Logged In At All
			if(err){
				req.flash("error", "Campground not found!")
				res.redirect("back");
			} else{
				// 	Does User Own the Campground
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				}
				else{
					res.redirect("back");
				}
			}
		});
	} else{
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
		// 	Is User Logged In At All
			if(err){
				res.redirect("back");
			} else{
				// 	Does User Own the Comment
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}
				else{
					req.flash("error", "You don't have permission to do that!")
					res.redirect("back");
				}
			}
		});
	} else{
		req.flash("error", "You Need To Be Logged In To Do That!")
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res ,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that!");
	res.redirect("/login");
}



module.exports = middlewareObj