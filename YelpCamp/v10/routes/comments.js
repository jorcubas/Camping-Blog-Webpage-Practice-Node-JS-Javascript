// =====================================================
// COMMENTS ROUTES 
// =====================================================

var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");
var middleware = require("../middleware");


// Comments New 
router.get("/new", middleware.isLoggedIn, function(req, res){
// 	find campground by id 
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}
		else{
			res.render("comments/new", {campground: campground});
		}
	});
});

// Comments Create
router.post("/", middleware.isLoggedIn, function(req, res){
// 		 Lookup Campground Using ID
		 Campground.findById(req.params.id, function(err, campground){
			if(err){
				req.flash("error", "Campground not found");
				console.log(err);
				res.redirect("/campgrounds");
			}
			 else{
				 Comment.create(req.body.comment, function(err, comment){
					 if(err){
						 
						 res.redirect("/campgrounds");
					 }
					 else{
						// 	add username and id to comment
						 comment.author.id = req.user._id;
						 comment.author.username = req.user.username;
// 						 save comment
						 comment.save();
						 campground.comments.push(comment);
						 campground.save();
						 console.log(comment);
						 req.flash("success", "Succesfully added comment");
						 res.redirect("/campgrounds/" + campground._id);
					 }
				 })
			 }
		 });
	});


// Comment Edit Route 
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			console.log(err);
			res.redirect("back");
		} else{
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment})
		}
	});
});

// CCOMMENT UPDATE APP
// campgrounds/:id/comments/:comment_id
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			re.redirect("back");
		} else{
			res.reirect("/campgrounds/"+ req.params.id)
		}
	});
});

// Comment Destroy Route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
// 	findByID and Remove
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		}
		else{
			req.flash("success", "Comment Deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
	
});

// function checkCommentOwnership(req, res, next){
// 	if(req.isAuthenticated()){
// 		Comment.findById(req.params.comment_id, function(err, foundComment){
// 		// 	Is User Logged In At All
// 			if(err){
// 				res.redirect("back");
// 			} else{
// 				// 	Does User Own the Comment
// 				if(foundComment.author.id.equals(req.user._id)){
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

// // Middleware
// function isLoggedIn(req, res, next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	else{
// 		res.redirect("/login");
// 	}
// }

module.exports = router;