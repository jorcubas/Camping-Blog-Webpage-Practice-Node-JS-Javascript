var mongoose = require("mongoose");
var Campground = require("./models/campgrounds");
var Comment = require("./models/comment");


var data = [
		{name: "Clouds Rest",
		image: "https://s3.amazonaws.com/imagescloud/images/medias/camping/camping-tente.jpg",
		description: "blah blah blah"},
		{name: "Sahara",
		image: "https://www.newzealand.com/assets/Tourism-NZ/Nelson/ba40378fe9/img-1536928144-4748-13836-F53C3949-ED9E-E0DC-CF6EC0D789D9308A__FocalPointCropWzQyNyw2NDAsNTAsNTAsODUsImpwZyIsNjUsMi41XQ.jpg",
		description: "blah blah blah"},
		{name: "Mont Blanc",
		image: "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/camping-quotes-1556677391.jpg?crop=0.588xw:1.00xh;0.157xw,0&resize=640:*",
		description: "blah blah blah"}	
	]


function seedDB(){
	// 	Remove All Campgrounds
	Campground.remove({}, function(err){
		if(err){
			console.log(err);
		}
		console.log("removed campgrounds");
		// Add a Few Campgrounds
		data.forEach(function(seed){
			Campground.create(seed, function(err, campground){
				if(err){
					console.log(err);
				}
				else{
					console.log("Added a Campground!");
					//Create a Comment
					Comment.create(
						{
							text: "Place was great, but bring good coats 'cause it's cold!",
							author: "Michelangelo"
						}, function(err, comment){
							if(err){
								console.log(err)
							}
							else{
								campground.comments.push(comment);
								campground.save();
								console.log("Created a new Comment");
								
							}
						});
				}
			});
		});		
	});	
}

	

module.exports = seedDB;