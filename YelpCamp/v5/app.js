var express 	= 	require("express"),	
	app 		= 	express(),
	mongoose 	= 	require("mongoose"),
	bodyParser 	= 	require("body-parser"),
	Campground	=	require("./models/campgrounds"),
	Comment		=	require("./models/comment"),
	seedDB 		=	require("./seeds");

seedDB();
mongoose.connect("mongodb://localhost/yelpcamp_v5");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
console.log(__dirname);
seedDB();

app.get("/", function(req, res){
	res.render("landing");
});

app.get("/campgrounds", function(req, res){
// 	Get All Campgrounds from DB 
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});
	// res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req, res){
// 	getdata from form and add campgrounds to array 
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampground = {name: name, image: image, description: desc}
// 	Create a New Campaground and Save to DataBase
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/campgrounds")		
		}
	});
// 	redirect to campgrounds page 
// 	default es redirect a get request 
	
});

app.get("/campgrounds/new", function(req, res){
	res.render("campgrounds/new.ejs")
});

app.get("/campgrounds/:id", function(req, res){
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

// =====================================================
// COMMENTS ROUTES 
// =====================================================

app.get("/campgrounds/:id/comments/new", function(req, res){
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


app.post("/campgrounds/:id/comments", function(req, res){
// 		 Lookup Campground Using ID
		 Campground.findById(req.params.id, function(err, campground){
			if(err){
				console.log(err);
				res.redirect("/campgrounds");
			}
			 else{
				 Comment.create(req.body.comment, function(err, comment){
					 if(err){
						 res.redirect("/campgrounds");
					 }
					 else{
						 campground.comments.push(comment);
						 campground.save();
						 res.redirect("/campgrounds/" + campground._id);
					 }
				 })
			 }
		 });
// 		 Create a New Comment
	
// 		 Connct New Comment to Campground
// 		 Redirect to Campground ShowPage
	
		 
	});



app.listen(3000, function(){
	console.log("YelpCamp server is now running")
});
